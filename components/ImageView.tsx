import React, { useState, Component } from "react";
const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');
let selectedFile: any;

type PreviewProps = {
    draftId: any;
    steps: any;
    editingStep: any;
};

type PreviewState = {
    upload: boolean;
};

export default class ImageView extends Component<PreviewProps, PreviewState> {
    constructor(props: PreviewProps) {
        super(props);
        this.state = {
            upload: false,
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
    }
    
    handleFileUpload(e: any) {
        selectedFile = e.target.files[0];
        this.setState({ upload: true });
        console.log(selectedFile);
    }

    handleFileSelect(e: any) {
        this.setState({ upload: false });
    }
    
    async handleFileSubmit(e: any) {
        // console.log(selectedFile);
    
        const toBase64 = (file: any) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    
        let stepId = this.props.steps[this.props.editingStep].id

        let data = {
            requestedAPI: "saveImage",
            draftId: this.props.draftId,
            stepId: stepId,
            imageFile: await toBase64(selectedFile),
        };
    
        // console.log(JSON.stringify(data));
    
        await fetch("/api/endpoint", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(data),
            }).then(async (res: any) => {
        });
    }

    render() {
        return (
            <div className={previewStyles.preview}>
                { !this.state.upload ? 
                    (<div> 
                        <label className={previewStyles.previewButtons}>
                            Upload File 
                            <input 
                                type="file" 
                                id="myFile" 
                                name="filename" 
                                accept="image/*" 
                                onChange={(e) => this.handleFileUpload(e)}
                            />
                        </label>
                    </div>)
                    : 
                    (<div className={previewStyles.submit}>
                        <p>
                            Selected {selectedFile.name} 
                        </p>
                        <div className={previewStyles.submitButtons}>
                            <button onClick={(e) => this.handleFileSelect(e)}>
                                Go Back
                            </button>
                            <button onClick={(e) => this.handleFileSubmit(e)}>
                                Submit
                            </button>
                        </div>
                    </div>)
                }
            </div>
        );
    }
}