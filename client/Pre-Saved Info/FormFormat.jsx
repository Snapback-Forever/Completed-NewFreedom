import React from 'react'



const FormFormat = () => {

    const locationList = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
        "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
        "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico",
        "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee",
        "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia",
        "Wisconsin", "Wyoming"
      ];

    const [form, setForm] = useState({
   
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //  WITHOUT IMAGE -------------------------------------------

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // Clone current form state
    //     const nextForm = { ...form };
    //     // Sanitize content for non-admins
    //  
    //         Object.keys(nextForm).forEach((key) => {
    //             if (key.toLowerCase().includes('content') && nextForm[key]) {
    //                 nextForm[key] = DOMPurify.sanitize(nextForm[key], {
    //                     FORBID_TAGS: [
    //                         'script',
    //                         'iframe',
    //                         'object',
    //                         'embed',
    //                         'form',
    //                         'input',
    //                         'button',
    //                         'link',
    //                         'meta',
    //                         'style',
    //                         'base',
    //                     ],
    //                     FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    //                 });
    //             }
    //         });
    //     
    //     // Let the thunk convert this to FormData and POST
    //     dispatch(addAdminLanding(nextForm));
    // };


    // WITH IMAGE ------------------------------------

    // const handleMenteeImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     if (formData.menteeImagePreview) {
    //         URL.revokeObjectURL(formData.menteeImagePreview);
    //     }
    //     const previewUrl = URL.createObjectURL(file);
    //     setFormData(prev => ({
    //         ...prev,
    //         menteeImageFile: file,
    //         menteeImagePreview: previewUrl
    //     }));
    // };

    // const handleClearUploadImage = (fieldPrefix) => async () => {
    //     const previewKey = `${fieldPrefix}Preview`;
    //     const fileKey = `${fieldPrefix}File`;
    //     const fileIdKey = `${fieldPrefix}FileId`;
    //     const bucketNameKey = `${fieldPrefix}BucketName`;
    //     const previewUrl = formData[previewKey];
    //     const fileId = formData[fileIdKey];
    //     const bucketName = formData[bucketNameKey];
    //     try {
    //         if (fileId && bucketName) {
    //             await fetch(`/upload/image/${fileId}?bucketName=${bucketName}`, {
    //                 method: "DELETE"
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Failed to delete image", err);
    //     }
    //     if (previewUrl && previewUrl.startsWith("blob:")) {
    //         URL.revokeObjectURL(previewUrl);
    //     }
    //     setFormData(prev => ({
    //         ...prev,
    //         [previewKey]: null,
    //         [fileKey]: null,
    //         [fileIdKey]: null,
    //         [bucketNameKey]: null,
    //         [fieldPrefix]: ""
    //     }));
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let uploadResult = null;
    //     try {
    //       if (formData.menteeImageFile) {
    //         const body = new FormData();
    //         body.append("image", formData.menteeImageFile);
    //         const res = await fetch("http://localhost:8080/upload/image", {
    //           method: "POST",
    //           body
    //         });
    //         if (!res.ok) {
    //           throw new Error("Image upload failed");
    //         }
    //         uploadResult = await res.json();
    //       }
    //       const payload = {
    //         ...formData,
    //         menteeImage: uploadResult?.url ?? formData.menteeImage,
    //         menteeImageFileId:
    //           uploadResult?.fileId ?? formData.menteeImageFileId,
    //         menteeImageBucketName:
    //           uploadResult?.bucketName ?? formData.menteeImageBucketName
    //       };
    //       // Remove client-only fields
    //       delete payload.menteeImageFile;
    //       delete payload.menteeImagePreview;
    //       dispatch(addMailUser(payload));
    //     } catch (err) {
    //       console.error("Submit error:", err);
    //     }
    //   };

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw"
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '80%',
    };



  return (
    <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

    <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>

    <h2 style={{ width: '100%', textAlign: 'center', color: 'black' }}>This Is The Content That Shows On Each Landing Page</h2>

{/* WITH AN IMAGE ------------------ */}

{/* {formData?.menteeImagePreview === null ? (
                    <>
                        <h4 style={labelStyle}>Image URL</h4>
                        <input
                            type="text"
                            name="menteeImage"
                            value={formData.menteeImage}
                            onChange={handleInput}
                            placeholder="http://example.com/image.jpg"
                            style={inputStyle}
                        />
                    </>
                ) : ""}

             {formData.menteeImage === "" ?    
             <div
                    style={{
                        width: "80%",
                        background: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "1rem"
                    }}>

                    <h4 style={labelStyle}>
                        {formData?.menteeImagePreview === null
                            ? "Or Upload Image"
                            : "Image Ready For Upload"}
                    </h4>
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.gif"
                        onChange={handleMenteeImageUpload}
                    />
                    {formData.menteeImagePreview && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img
                                src={formData.menteeImagePreview}
                                style={{ maxWidth: "120px", marginTop: "10px" }}
                            />
                            <button
                                type="button"
                                onClick={handleClearUploadImage("menteeImage")}
                             style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                            >
                                Cancel Image
                            </button>
                        </div>
                    )}
                </div> : ""} */}



        </div>
      
    </div>
  )
}

export default FormFormat
