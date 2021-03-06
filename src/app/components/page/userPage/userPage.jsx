import PropTypes from 'prop-types';
import React from 'react';
import { CommentsProvider } from '../../../hooks/useComments';
import { useProfessions } from '../../../hooks/useProfession';
import { useUsers } from '../../../hooks/useUsers';
import MeetingsCard from '../../ui/cards/meetingsCard';
import QualitiesCard from '../../ui/cards/qualitiesCard';
import UserCard from '../../ui/cards/userCard';
import Comments from '../../ui/comments';

const UserPage = ({ userId }) => {
  const { getUserById } = useUsers();
  const { getProfessionById, isLoading: professionLoading } = useProfessions();
  let user = getUserById(userId);

  if (!professionLoading) {
    user = { ...user, profession: getProfessionById(user.profession) };
    return (
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <UserCard user={user} />
            <QualitiesCard data={user.qualities} />
            <MeetingsCard value={user.completedMeetings} />
          </div>

          <div className="col-md-8">
            <CommentsProvider>
              <Comments />
            </CommentsProvider>
          </div>
        </div>
      </div>
    );
  }
  return <h2>Loading...</h2>;
};

UserPage.propTypes = {
  userId: PropTypes.string.isRequired
};

export default UserPage;
