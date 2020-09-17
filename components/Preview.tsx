import React, { useEffect, Component } from "react";
const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');
let selectedImage: any;

type PreviewProps = {
    draftId: string;
    steps: any;
    editingStep: number;
    addStepImage: (image: any, draftId: string, stepId: string) => void;
    deleteStepImage: (draftId: string, stepId: string) => void;
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

    componentDidUpdate(nextProps: any) {
        const currStep  = this.props.editingStep;
        if (nextProps.editingStep !== currStep) {
            this.setState({ upload: false });
        }
    }
    
    handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        selectedImage = e.target.files![0];
        this.setState({ upload: true });
        this.setState({ uploadFailed: false });
    }

    handleImageSelect() {
        this.setState({ upload: false });
        this.setState({ uploadFailed: false });
    }
    
    async handleImageSubmit() {
        // 5 MB max on image uploads
        if (selectedImage.size > 5000000) {
            this.setState({ uploadFailed: true });
        } else {
            // optimistic mutate
            var url = URL.createObjectURL(selectedImage);
            this.props.steps[this.props.editingStep].imageURL = url;
            this.setState({ upload: false });

            let stepId = this.props.steps[this.props.editingStep].id;
            await this.props.addStepImage(selectedImage, this.props.draftId, stepId);
            // this.setState({ upload: false });
        }
    }

    async handleImageDelete() {
        let stepId = this.props.steps[this.props.editingStep].id;
        this.props.deleteStepImage(this.props.draftId, stepId);
        this.setState({ upload: false });
    }

    ImageScreen(props: {
        steps: any;
        editingStep: number;
        handleImageDelete: () => void;
      }) {
        return (
            (<div className={previewStyles.imgView}> 
                <div className={previewStyles.remove} onClick={(e) => props.handleImageDelete()}>X</div>
                <img src={props.steps[props.editingStep].imageURL}></img>
            </div>
            )
        );
      }

    UploadScreen(props: {
        handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) {
        return (
            (<div className={previewStyles.preview}> 
                <label className={previewStyles.previewButtons}>
                    Upload File 
                    <input 
                        type="file" 
                        id="myFile" 
                        name="filename" 
                        accept="image/*" 
                        onChange={(e) => props.handleImageUpload(e)}
                    />
                </label>
            </div>
            )
        );
    }

    SelectScreen(props: {
        handleImageSelect: () => void;
        handleImageSubmit: () => void;
        uploadFailed: boolean;
    }) {
        return (
            (<div className={previewStyles.preview}>
                <div className={previewStyles.submit}>
                    <p>
                        Selected {selectedImage.name} 
                    </p>
                    <div className={previewStyles.submitButtons}>
                        <button onClick={(e) => props.handleImageSelect()}>
                            Go Back
                        </button>
                        <button onClick={(e) => props.handleImageSubmit()}>
                            Submit
                        </button>
                    </div>
                    {props.uploadFailed ? <div><br></br>Image size is too big! Select an image size up to 5mb.</div> : <div></div>}
                </div>
            </div>
            )
        );
    }

    render() {
        return (
            <div>
                { !this.state.upload ? 
                    // Image is in display or the upload option is available
                    (this.props.steps[this.props.editingStep]?.imageURL !== undefined ? 
                        // Image is in display
                        <this.ImageScreen 
                            steps={this.props.steps} 
                            editingStep={this.props.editingStep}
                            handleImageDelete={this.handleImageDelete}/>
                        :
                        // Upload screen is in display
                        <this.UploadScreen handleImageUpload={this.handleImageUpload}/>
                    )
                    : 
                    // Image has been selected, and "Go Back" & "Submit" options are available
                    // If selected file size was too big, error is displayed
                    <this.SelectScreen 
                        handleImageSelect={this.handleImageSelect} 
                        handleImageSubmit={this.handleImageSubmit}
                        uploadFailed={this.state.uploadFailed}/>
                }
            </div>
        );
    }
}