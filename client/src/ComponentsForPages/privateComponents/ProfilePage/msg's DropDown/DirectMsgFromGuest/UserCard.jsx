import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { forwardDirectMsg } from '../../../../../redux/reducers/directMsgStaffReducers';

const UserCard  = ({ user, setFindUser, msg, setTrigger  }) => {

    const dispatch = useDispatch()
   
    const onlineUser = useSelector(state => state.auth.onlineUser)
    const isOnline = onlineUser?.includes(user?._id)
  
    const sendDirectMsg = () => {
        const payload = {
            directMsgId: msg?._id,
            targetUserId: user?._id,
        }
  
        dispatch(forwardDirectMsg(payload))
        setFindUser(false)
        setTrigger(true)
    }
  
    return (
        <div>
  
            <Card style={{ width: '18rem', margin: "1vw" }} key={crypto.randomUUID()} className='responsiveUserCard'>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
  
                    <Card.Title>{isOnline ?
                        <div style={{ fontSize: "small", background: "lime" }}>online</div>
                        : <div style={{ fontSize: "small", background: "red" }}>offline</div>}</Card.Title>
  
                    <Card.Title>{user?.accountName}</Card.Title>
                    <Card.Text>{user?.staffPosition}</Card.Text>
                    <div className='flex flex-col'>
  
                        <button className='m-1 rounded' style={{ background: "lightBlue", width: "100%" }} onClick={() => sendDirectMsg()}>Forward Msg</button>
  
                    </div>
                </Card.Body>
            </Card>
  
        </div>
    )
  }

export default UserCard
