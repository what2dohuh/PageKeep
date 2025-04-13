import ProfileCom from '../components/profile.com';
import Loading from '../components/loading';
import { useUser } from '../contexAPI/userContex';

const Profile = () => {
    const { loading,error} = useUser();

    if (loading) {
        return <div><Loading/></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {loading ? <div>loading</div>: <ProfileCom />}
         
        </div>
    );
};

export default Profile;
