const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');
let selectedFile: any;

function handleFileUpload(e: any) {
    selectedFile = e.target.files[0];
    console.log(e.target.files);
    console.log(selectedFile);
}

async function handleFileSubmit(e: any) {
    console.log(selectedFile);
    // const uploadTask = storage.ref.child(`images/${selectedFile.name}`).put(selectedFile); 
    // let formData = new FormData();
    // formData.append('requestedAPI', "saveImage");
    // formData.append('name', 'ABC'); 
    // formData.append('imageFile', selectedFile);
    // for (var key of formData.entries()) {
        // console.log(key[0] + ', ' + key[1])
    // }
    // var newFile  = {
    //     'lastModified'     : selectedFile.lastModified,
    //     'lastModifiedDate' : selectedFile.lastModifiedDate,
    //     'name'             : selectedFile.name,
    //     'size'             : selectedFile.size,
    //     'type'             : selectedFile.type
    //  };
    const toBase64 = (file: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    let data = {
      requestedAPI: "saveImage",
      imageFile: await toBase64(selectedFile),
    };
    console.log(JSON.stringify(data));

    // mutate(optimisticSteps, false);

    // await fetch("/api/endpoint", {
    //   method: "POST",
    //   body: formData,
    // //   headers: new Headers({ "Content-Type": "application/json" }),
    // //   body: formData,
    // }).then(async (res: any) => {
    //   // let resJSON = await res.json();
    //   // mutate(resJSON, false);
    // });
    await fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
      });
  }

export default function Preview() {
    return (
        <div className={previewStyles.preview}>
            <div className={previewStyles.previewButtons}>
                <input type="file" id="myFile" name="filename" onClick={(e) => handleFileUpload(e)}/>
                <input type="submit" onClick={(e) => handleFileSubmit(e)}/>
            </div>
        </div>
    );
}