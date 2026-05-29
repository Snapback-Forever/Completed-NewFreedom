import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGraduate } from '../../../../../redux/reducers/locationReducer';

const AddGraduate = ({ mentee, user, setTrigger, setAddInformation }) => {
    
    const baseUrl = 'http://localhost:8080';
    
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    programId: mentee?.programsEnrolled?.[0]?._id || '',
    mailId: mentee?._id || '',
    gradImage: '', 
    gradImageFileId: '', 
    gradImageBucketName: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5vw',
  };

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '80%',
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    // Handle gradImage URL specially so it is mutually exclusive with file upload
    if (name === 'gradImage') {
      const urlValue = value;
      // If user starts typing a URL, clear any uploaded file and preview
      if (urlValue) {
        // best-effort delete of any existing file
        deletePreviousImageIfAny();
        setForm((prev) => ({
          ...prev,
          gradImage: urlValue,
          gradImageFileId: '',
          gradImageBucketName: '',
        }));
        setPreviewUrl(urlValue);
      } else {
        setForm((prev) => ({
          ...prev,
          gradImage: '',
        }));
        setPreviewUrl('');
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };
  const deletePreviousImageIfAny = async () => {
    if (!form.gradImageFileId || !form.gradImageBucketName) return;
    try {
      await fetch(
        `${baseUrl}/upload/image/${form.gradImageFileId}?bucketName=${form.gradImageBucketName}`,
        { method: 'DELETE' }
      );
    } catch (err) {
      console.error('Failed to delete previous image:', err);
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // If a URL was previously set, clear it because now we are using a file
    if (form.gradImage) {
      setForm((prev) => ({
        ...prev,
        gradImage: '',
      }));
      setPreviewUrl('');
    }
    // delete previously uploaded, now-unused image
    await deletePreviousImageIfAny();
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${baseUrl}/upload/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      const data = await res.json();
      // { message, fileId, filename, bucketName }
      setForm((prev) => ({
        ...prev,
        gradImage: '', // we are using file, not URL
        gradImageFileId: data.fileId,
        gradImageBucketName: data.bucketName,
      }));
      const url = `${baseUrl}/upload/image/${data.fileId}?bucketName=${data.bucketName}`;
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = async () => {
    // if using file, delete it
    await deletePreviousImageIfAny();
    setForm((prev) => ({
      ...prev,
      gradImage: '',
      gradImageFileId: '',
      gradImageBucketName: '',
    }));
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Image is required: either URL or file
    const hasUrl = !!form.gradImage;
    const hasFile = !!form.gradImageFileId;
    if (!hasUrl && !hasFile) {
      return;
    }
    const payload = {
      programId: form.programId,
      mailId: form.mailId,
      gradImage: form.gradImage,                  // URL if used, else ''
      gradImageFileId: form.gradImageFileId,      // fileId if used, else ''
      gradImageBucketName: form.gradImageBucketName,
    };
    
    dispatch(addGraduate(payload));
      setTrigger(true);
      setAddInformation(false)
  };
  const hasFile = !!form.gradImageFileId;
  const hasUrl = !!form.gradImage;
  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Hidden IDs */}
        <input
          type="hidden"
          name="programId"
          value={form?.programId}
          onChange={handleInput}
        />
        <input
          type="hidden"
          name="mailId"
          value={form?.mailId}
          onChange={handleInput}
        />
        <label style={labelStyle}>
          Graduation Image (<u>Required:</u> URL or uploaded file)
        </label>
        {/* URL input (only enabled if no file is selected) */}
        <input
          type="text"
          name="gradImage"
          placeholder="https://example.com/image.jpg"
          value={form?.gradImage}
          onChange={handleInput}
          style={inputStyle}
          disabled={hasFile}
        />
        {/* File input (only enabled if no URL is set) */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={inputStyle}
          disabled={hasUrl}
        />
        {uploading && (
          <div style={{ width: '80%', textAlign: 'center' }}>
            Uploading image...
          </div>
        )}
        {/* Preview from URL or uploaded file */}
        {previewUrl && (
          <div style={{ width: '80%', textAlign: 'center', marginTop: '0.5rem' }}>
            <img
              src={previewUrl}
              alt="Graduate preview"
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        )}
        {(hasFile || hasUrl) && (
          <button
            type="button"
            style={{ background: "red", margin: "1vh", width: "100%" }}
            onClick={handleClearImage}
          >Clear Image </button> )}

       <button type="submit" style={{ background: "lime", margin: "1vh", width: "100%" }}>Save Graduate</button>
      </div>
    </form>
  );
};
export default AddGraduate;