

const url= `https://api.cloudinary.com/v1-1/:cloudName/auto/upload`

const uploadFile = async(file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "UPLOAD PRESET NAME HERE")

    const response = await fetch(url, {
        method: "post",
        body: formData
    })
    const responseData = await response.json()

    return responseData
}

export default uploadFile