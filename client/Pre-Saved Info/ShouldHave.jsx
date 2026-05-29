import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShouldHave = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user)
    const userId = useSelector(state => state.auth.user?._id)
    const socketConnection = useSelector(state => state.auth.socketConnection)

    const [navPath, setNavPath] = useState()

    const linkToPage = (e) => {
        const path = e.target.value
        setNavPath(path)
        navigate(path)
    }

    // SOCKET CONNECTION

    const token = useSelector(state => state.auth.token)
    const onlineUser = useSelector(state => state.auth.onlineUser)
    useEffect(() => {
        const socketConnection = io("http://localhost:8080", {
            auth: {
                token: token
            }
        })

        socketConnection.on("onlineUser", (data) => {
            dispatch(setOnlineUser(data))
        })

        dispatch(setSocketConnection(socketConnection))

        return () => {
            socketConnection.disconnect()
        }

    }, [])

    const [showMailIcon, setShowMailIcon] = useState()
    useEffect(() => {
        socketConnection?.on("message", (messages) => {
            const hasUnseen = messages?.some(
                msg => !msg.seen && msg.accountName !== user.accountName
            );

            setShowMailIcon(hasUnseen); // show 📬 if true, 📭 if false
        });
        return () => socketConnection?.off("message");
    }, [socketConnection, user?.accountName]);

    // END OF SOCKET

  return (
    <div>
      
    </div>
  )
}

export default ShouldHave
