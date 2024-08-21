import React, { useEffect, useState } from 'react';
import styles from './userProfile.module.css';
import { getCurrentUser } from '../../auth';
const UserProfile = () => {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        setUser(getCurrentUser);
    }, [user])

    return (
        <div className={styles.UserProfile}>
            <div className={styles.container}>
                <h3>{user}</h3>
                <div className={styles.userEditProfile}>
                        <input type="text" placeholder='username'/>
                        <input type="text" placeholder='Mobile Number'/><br></br>
                        <button type="submit" className={styles.update_profile}>Work In Progress</button>
                </div>
            </div>
            
        </div>
    )
}

export default UserProfile;