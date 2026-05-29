import React,{useState} from "react"
import {useDispatch} from "react-redux"
import DOMPurify from "dompurify"
import {addAdminAdditionalImage} from "../../../../../redux/reducers/adminReducers"

const AddImageModal=({section,setAddImages})=>{

const dispatch=useDispatch()

const[input,setInput]=useState({
preview:null,
file:null,
link:"",
description:""
})

const inputStyle={border:"solid lightGrey",background:"white",width:"80%"}

const handleUploadImage=e=>{
const file=e.target.files[0]

if(!file)return

if(input.preview)URL.revokeObjectURL(input.preview)

const preview=URL.createObjectURL(file)

setInput(p=>({...p,preview,file}))
}

const cancelImage=()=>{

if(input.preview)URL.revokeObjectURL(input.preview)

setInput({
preview:null,
file:null,
link:"",
description:""
})
}

const handleSaveImage=async(e)=>{

e.preventDefault()

if(!input.file){
alert("Please select an image")
return
}

if(!input.description.trim()){
alert("Image description is required")
return
}

let cleanDescription=input.description

cleanDescription=DOMPurify.sanitize(cleanDescription,{
FORBID_TAGS:["script","iframe","object","embed","form","input","button","link","meta","base"],
FORBID_ATTR:["onerror","onload","onclick"]
})

try{

await dispatch(addAdminAdditionalImage({
section:section.replace("AdditionalImages",""),
file:input.file,
description:cleanDescription,
link:input.link
})).unwrap?.()

cancelImage()

}catch(err){

console.error("Failed to save image:",err)

}
}

return(

<div className="addImageProModal scrollBar">

<button
type="button"
style={{fontSize:"2rem"}}
onClick={()=>setAddImages(null)}
>
❎
</button>

<h2 style={{textAlign:"center"}}>Add Image</h2>

<form
onSubmit={handleSaveImage}
style={{display:"flex",flexDirection:"column",width:"100%",height:"73%",justifyContent:"center",alignItems:"center"}}
>

<label style={{textAlign:"center"}}>
<b>Select Image:</b>
</label>

<input
type="file"
accept="image/*"
onChange={handleUploadImage}
style={inputStyle}
required
/>

{input?.preview&&

<div style={{border:"double black",width:"60%",display:"flex",flexDirection:"column",alignItems:"center",padding:"1vh 0"}}>

<label>
<b>Image Preview:</b>
</label>

<img
src={input?.preview}
alt="preview"
style={{width:"200px",margin:"1vh 0"}}
/>

<button
type="button"
style={{width:"60%",background:"red"}}
onClick={cancelImage}
>
Cancel Image
</button>

</div>
}

<label style={{textAlign:"center"}}>
<b>Image Link (optional):</b>
</label>

<input
type="text"
value={input?.link}
onChange={e=>setInput(p=>({...p,link:e.target.value}))}
style={inputStyle}
/>

<label style={{textAlign:"center"}}>
<b>Description:</b>
</label>

<textarea
value={input.description}
onChange={e=>setInput(p=>({...p,description:e.target.value}))}
style={inputStyle}
rows={8}
required
/>

<div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>

<button
type="submit"
style={{background:"goldenRod",margin:"1vh 0",width:"90%"}}
>
Save Image
</button>

<button
type="button"
onClick={()=>setAddImages(null)}
style={{background:"red",width:"90%"}}
>
Done Adding Images
</button>

</div>

</form>

</div>
)
}

export default AddImageModal