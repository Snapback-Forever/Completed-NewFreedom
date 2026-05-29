import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';

const UserCard  = ({ user, setOpenModalUser, onAddRecipient }) => {

    const onlineUser = useSelector(state => state.auth.onlineUser);

    const isOnline = onlineUser?.includes(user?._id);

    const handleSelectUser = () => {
      if (user?.accountNameNormalized) {
        onAddRecipient(user.accountNameNormalized);
      } else if (user?.accountName) {
        // fallback: normalize on client if needed
        const normalized = user.accountName.toLowerCase().trim().replace(/\s+/g, "");
        onAddRecipient(normalized);
      }
      // optionally keep modal open to add multiple users; don’t close here
      // setOpenModalUser(false);
    };

    return (
      <div>
        <Card style={{ width: '18rem', margin: "1vw" }} key={crypto.randomUUID()} className='responsiveUserCard'>
          <Card.Body>
            <Card.Title>{isOnline ?
              <div style={{ fontSize: "small", background: "lime" }}>online</div>
              : <div style={{ fontSize: "small", background: "red" }}>offline</div>}
            </Card.Title>
            <Card.Title>{user?.accountName}</Card.Title>
            <Card.Text>{user?.staffPosition}</Card.Text>
            <div className='flex flex-col'>
              <button
                className='m-1 rounded'
                style={{ background: "lightBlue", width: "100%" }}
                onClick={handleSelectUser}
              >
                Add To Group
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };
  export default UserCard;