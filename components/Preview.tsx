const previewStyles = require('../styles/Preview.module.scss');

export default function Preview() {
    return (
        <div className={previewStyles.preview}>
            <div className={previewStyles.previewButtons}>
                <input type="file" id="myFile" name="filename" />
                <input type="submit" />
            </div>
        </div>
    );
}