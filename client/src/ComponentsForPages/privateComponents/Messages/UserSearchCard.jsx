import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, setOpenSearchModal }) => {

    const onlineUser = useSelector(state => state.auth.onlineUser)
    const isOnline = onlineUser?.includes(user?._id)

    const baseUrl = 'http://localhost:8080';
    const profilePicSrc = (user?.profilePicFileId && user?.profilePicBucketName)
      ? `${baseUrl}/upload/image/${user?.profilePicFileId}?bucketName=${user?.profilePicBucketName}` : user?.profilePic || defaultImage

    return (
        <div>

            <Card style={{ width: '18rem', margin: "1vw" }} key={crypto.randomUUID()} className='responsiveUserCard'>
                <Card.Img variant="top" src={profilePicSrc} style={{ minWidth:"100%", maxWidth: "100%", minHeight: "15vh", maxHeight: "15vh" }} />
                <Card.Body>

                    <Card.Title>{ isOnline ? 
                    <div style={{ fontSize: "small", background: "lime" }}>online</div> 
                    : <div style={{ fontSize: "small", background: "red" }}>offline</div>}</Card.Title>

                    <Card.Title>{user?.accountName}</Card.Title>
                    <Card.Text>{user?.staffPosition}</Card.Text>
                    <div className='flex flex-col'>
                        <Link to={`/messagePage/${user?._id}`} className='m-1 rounded' style={{ color: "black" }} onClick={()=> setOpenSearchModal(false)}>
                            <button className='m-1 rounded' style={{ background: "lightBlue", width: "100%" }} >📨 {user?.accountName}</button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>

        </div>
    )
}

export default UserSearchCard
