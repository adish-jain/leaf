import React, { useState, Component } from "react";
const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');
let selectedImage: any;

type PreviewProps = {
    draftId: any;
    steps: any;
    editingStep: any;
    addStepImage: (image: any, draftId: any, stepId: any) => void;
    deleteStepImage: (draftId: any, stepId: any) => void;
};

type PreviewState = {
    upload: boolean;
    uploadFailed: boolean;
};

export default class Preview extends Component<PreviewProps, PreviewState> {
    constructor(props: PreviewProps) {
        super(props);
        this.state = {
            upload: false,
            uploadFailed: false,
        };
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);
        this.handleImageSubmit = this.handleImageSubmit.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);
    }
    
    handleImageUpload(e: any) {
        selectedImage = e.target.files[0];
        this.setState({ upload: true });
        this.setState({ uploadFailed: false });
        console.log(selectedImage);
    }

    handleImageSelect(e: any) {
        this.setState({ upload: false });
        this.setState({ uploadFailed: false });
    }
    
    async handleImageSubmit(e: any) {
        // 50 MB max on image uploads
        if (selectedImage.size > 50000000) {
            this.setState({ uploadFailed: true });
        } else {
            let stepId = this.props.steps[this.props.editingStep].id;
            await this.props.addStepImage(selectedImage, this.props.draftId, stepId);
            this.setState({ upload: false });
        }
    }

    async handleImageDelete(e: any) {
        let stepId = this.props.steps[this.props.editingStep].id;
        this.props.deleteStepImage(this.props.draftId, stepId);
        this.setState({ upload: false });
    }

    render() {
        return (
            <div>
                { !this.state.upload ? 
                    (this.props.steps[this.props.editingStep].image !== undefined ?
                        (<div className={previewStyles.imgView}> 
                            <div className={previewStyles.remove} onClick={(e) => this.handleImageDelete(e)}>X</div>
                            <img src={this.props.steps[this.props.editingStep].image}></img>
                        </div>
                        )
                        :
                        (<div className={previewStyles.preview}> 
                            <label className={previewStyles.previewButtons}>
                                Upload File 
                                <input 
                                    type="file" 
                                    id="myFile" 
                                    name="filename" 
                                    accept="image/*" 
                                    onChange={(e) => this.handleImageUpload(e)}
                                />
                            </label>
                        </div>
                        )
                    )
                    : 
                    (<div className={previewStyles.preview}>
                        <div className={previewStyles.submit}>
                            <p>
                                Selected {selectedImage.name} 
                            </p>
                            <div className={previewStyles.submitButtons}>
                                <button onClick={(e) => this.handleImageSelect(e)}>
                                    Go Back
                                </button>
                                <button onClick={(e) => this.handleImageSubmit(e)}>
                                    Submit
                                </button>
                            </div>
                            {this.state.uploadFailed ? <div><br></br>File size is too big</div> : <div></div>}
                        </div>
                    </div>
                    )
                }
            </div>
        );
    }
}