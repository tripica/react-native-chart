/* @flow */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { uniqueValuesInDataSet } from './util';

const styles = StyleSheet.create({
	yAxisContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
		paddingVertical: 0,
		paddingRight: 5,
		alignItems: 'flex-end',
	},
});


export default class YAxis extends Component<void, any, any> {

	static propTypes = {
		axisColor: PropTypes.any,
		axisLineWidth: PropTypes.number,
		labelFontFamily: PropTypes.string.isRequired,
		data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.array)).isRequired,
		height: PropTypes.number.isRequired,
		placement: PropTypes.oneOf(['left', 'right']),
		verticalGridStep: PropTypes.number.isRequired,
		showYAxisLabels: PropTypes.bool.isRequired,
		yAxisTransform: PropTypes.func,
		yAxisUseDecimal: PropTypes.bool,
		yAxisShortLabel: PropTypes.bool,
	};

	static defaultProps : any = {
		placement: 'left',
	};

	constructor(props : any) {
		super(props);
		this.state = { bounds: { min: 0, max: 0 } };
	}

	// Credits:  Martin Sznapka, StackOverflow, QuestionID: 9461621
	shortenLargeNumber(num, useDecimal) {
		let digits = (useDecimal) ? 2 : 0;
		var units = ['K', 'M', 'B', 't', 'P', 'E', 'Z', 'Y'],
				decimal;
		for (var i=units.length-1; i>=0; i--) {
				decimal = Math.pow(1000, i+1);

				if(num <= -decimal || num >= decimal) {
						return +(num / decimal).toFixed(digits) + units[i];
				}
		}
		return num;
	}

	_createLabelForYAxis = (index : number) => {
		if (!this.props.showYAxisLabels) return null;
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}
		minBound = (minBound < 0) ? 0 : minBound;
		let label = minBound + (maxBound - minBound) / this.props.verticalGridStep * index;
		label = parseFloat(label.toFixed(1));
		const labelRounded = Math.round(label);

		if (/* !this.props.yAxisUseDecimal && */index !== 0 && labelRounded > 2) {
			label = labelRounded;
		}

		if (this.props.yAxisShortLabel) {
			label = this.shortenLargeNumber(label, this.props.yAxisUseDecimal);
		}


		if (this.props.yAxisTransform && typeof this.props.yAxisTransform === 'function') {
			label = this.props.yAxisTransform(label);
		}
		return (
			<Text
				style={{
					color: this.props.axisLabelColor,
					fontSize: this.props.labelFontSize,
					fontFamily: this.props.labelFontFamily,
				}}
				key={index}
			>
				{label}
			</Text>
		);
	};

	render() {
		const range = [];
		const steps = this.props.verticalGridStep || 4;
		for (let i = steps; i >= 0; i--) range.push(i);
		return (
			<View
				style={[
					styles.yAxisContainer,
					this.props.style || {},
					this.props.placement === 'left' && { borderRightColor: this.props.axisColor, borderRightWidth: this.props.axisLineWidth },
					this.props.placement === 'right' && { borderLeftColor: this.props.axisColor, borderLeftWidth: this.props.axisLineWidth },
				]}
			>
				{range.map(this._createLabelForYAxis)}
			</View>
		);
	}
}
