import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forwardQuestionToDirectMsg } from '../../../../../redux/reducers/questionReducers';

const UserCard = ({ user, setFindUser, quest, setTrigger, setResponse }) => {

  const dispatch = useDispatch()
 
  const onlineUser = useSelector(state => state.auth.onlineUser)
  const isOnline = onlineUser?.includes(user?._id)

  const sendDirectMsg = () => {
      const payload = {
          id: quest?._id,
          recipientUserId: user?._id,
          includeAllResponses: true
      }

      dispatch(forwardQuestionToDirectMsg(payload))
      setTrigger(true)
      setFindUser(false)
      setResponse(false)
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
