const previewStyles = require('../styles/Preview.module.scss');

export default function Preview() {
    return (
        <div className={previewStyles.preview}>
            <div className={previewStyles.togglePreview}>Preview</div>
            <div className={previewStyles.previewImage}>
                <img alt="sudoku" src='/images/sudoku.svg' />
            </div>
        </div>
    );
}