import React, { useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { removeGraduate, updateGraduate } from '../../../../redux/reducers/locationReducer';
import { Link } from 'react-router-dom';

const AllGradCard = ({ grad, setTrigger }) => {

    const dispatch = useDispatch()

    const user = useSelector(state => state.auth.user)

    const [formImage, setFormImage] = useState({
        gradPreview: null,
        gradFile: null
    });
    
    const baseUrl = "http://localhost:8080";
    const imgSrc =
        formImage.gradPreview ||
        (grad?.gradImageFileId && grad?.gradImageBucketName
            ? `${baseUrl}/upload/image/${grad.gradImageFileId}?bucketName=${grad.gradImageBucketName}`
            : grad?.gradImage);

    const handleUploadGradImage = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setFormImage((prev) => ({
                ...prev,
                gradPreview: null,
                gradFile: null
            }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormImage((prev) => ({
                ...prev,
                gradPreview: reader.result,
                gradFile: file
            }));
        };
        reader.readAsDataURL(file);
    };

    const clearUpload = () => {
        if (formImage.gradPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(formImage.gradPreview);
        }
        setFormImage(prev => ({
            ...prev,
            gradFile: null,
            gradPreview: null
        }));
    };

    const handleSaveGradImage = async (programId) => {
        const file = formImage.gradFile;
        if (!file) return;
        const fd = new FormData();
        fd.append("image", file);
        const hasGridFsImage =
            !!grad.gradImageFileId && !!grad.gradImageBucketName;
        const uploadUrl = hasGridFsImage
            ? `${baseUrl}/upload/image/${grad.gradImageFileId}?bucketName=${grad.gradImageBucketName}`
            : `${baseUrl}/upload/image`;
        const uploadRes = await fetch(uploadUrl, {
            method: hasGridFsImage ? "PUT" : "POST",
            body: fd
        });
        if (!uploadRes.ok) {
            console.error("Grad image upload failed");
            return;
        }
        const { fileId, bucketName } = await uploadRes.json();
        const httpUrl = `${baseUrl}/upload/image/${fileId}?bucketName=${bucketName}`;
        const payload = {
            programId,
            mailId: grad.mailuser?._id,
            gradImage: httpUrl,
            gradImageFileId: fileId,
            gradImageBucketName: bucketName
        };
        try {
            await dispatch(updateGraduate(payload)).unwrap?.();
            setTrigger(prev => !prev);
        } catch (err) {
            console.error("updateGrad failed:", err);
            return;
        }
        setFormImage({
            gradPreview: null,
            gradFile: null
        });
    };

    const clickCountRef = useRef(0);
    const timeoutRef = useRef(null);
    const deleteThisGraduate = (programId) => {
        clickCountRef.current += 1;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 800);
        if (clickCountRef.current === 3) {
            const payload = {
                programId: programId,
                mailId: grad.mailuser?._id,
                currentUserId: user?._id
            };
            dispatch(removeGraduate(payload));
            setTrigger(true);
            clickCountRef.current = 0;
            clearTimeout(timeoutRef.current);
        }
    };


    return (
        <div style={{ width: '30vw', height: "55vh", display: 'flex', flexDirection: 'column', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem 1vw', margin: "1vh 1vw" }} className='responsiveGradCard'>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>
                    Grad Date: {moment(grad?.gradDate).format("hh:mm MMM Do YY")}
                </span>
            </div>
            <div style={{ width: "100%" }}>
                <img
                    src={imgSrc}
                    style={{ minWidth: "99%", maxWidth: "90%", minHeight: "30vh", maxHeight: "30vh" }}
                    alt="Graduate"
                />
            </div>
           { user?.NFadmin || user?.creator ? <input type="file" accept="image/*" onChange={handleUploadGradImage} style={{ background: "white", margin: "1vh 0" }} /> : ""} 

            {formImage.gradPreview && (
                <>
                    <button onClick={() => handleSaveGradImage(grad?.programId)} style={{ background: "lime", padding: "0 2vw" }}>Save Image</button>
                    <button onClick={clearUpload} style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }}>Cancel</button>
                </>
            )}

            <div style={{ width: "100%", display: "flex", flexDirection: 'column', alignItems: "center" }}>
                <span><b>First Name:</b> {grad?.firstName}</span>
                <span><b>Last Name:</b> {grad?.lastName}</span>
                <span><b>Program Graduated:</b> {grad?.programName}</span>
            </div>
            <Link to={`/viewProgram/${grad?.programId}`}>
            <button style={{ background: "green", width: "100%", color: "white", margin: "1vh 0" }}>Visit This Program</button>
            </Link>

          { user?.creator || user?.NFadmin ? <button style={{ background: "red", marginBottom: "1vh" }} onClick={()=> deleteThisGraduate(grad?.programId)}>Delete Graduate</button> : ""}

        </div>
    )
}
export default AllGradCard