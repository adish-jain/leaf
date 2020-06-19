import React, { Component, ReactElement } from "react";
const fileNamesStyle = require('../styles/FileNames.module.scss');

type FileNameProps = {
	selected: boolean;
	changeSelected: (selected_file: number) => void;
    index: number;
    children: string;
};

export class FileNam1e extends Component<FileNameProps> {
	constructor(props: FileNameProps) {
		super(props);

		this.state = {};
	}

	render() {
		let style = {
			color: "white",
		};
		if (!this.props.selected) {
			style.color = "#898984";
		}

		return (
			<div
				style={style}
				onClick={(e) => {
					this.props.changeSelected(this.props.index);
				}}
				className="filename"
			>
				{this.props.children}
			</div>
		);
	}
}


export default function FileName(props: FileNameProps) {

    let style = {
        color: "white",
    };
    if (!props.selected) {
        style.color = "#898984";
    }

    return(
        <div
				style={style}
				onClick={(e) => {
					props.changeSelected(props.index);
				}}
				className={fileNamesStyle.filename}
			>
				{props.children}
			</div>
    );


}