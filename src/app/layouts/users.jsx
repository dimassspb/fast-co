import React from 'react';
import { useParams, Redirect } from 'react-router';
import UsersListPage from '../components/page/usersListPage';
import UserPage from '../components/page/userPage';
import EditUserPage from '../components/page/editUserPage/editUserPage.jsx';
import UserProvider from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const { currentUser } = useAuth();

  return (
    <>
      <UserProvider>
        {userId && edit ? (
          currentUser._id === userId ? (
            <EditUserPage />
          ) : (
            <Redirect to={`/users/${currentUser._id}/edit`} />
          )
        ) : userId ? (
          <UserPage userId={userId} />
        ) : (
          <UsersListPage />
        )}
      </UserProvider>
    </>
  );
};

export default Users;
