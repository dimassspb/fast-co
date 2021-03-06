import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useProfessions } from '../../../hooks/useProfession';
import { useQualities } from '../../../hooks/useQuality';
import { validator } from '../../../utils/validator';
import MultiSelectField from '../../common/form/multiSelectField';
import RadioField from '../../common/form/radioField';
import SelectField from '../../common/form/selectField';
import TextField from '../../common/form/textField';

const EditUserPage = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [errors, setErrors] = useState({});
  const { currentUser, updateUser } = useAuth();
  const { professions, isLoading: professionsLoading } = useProfessions();
  const { qualities, isLoading: qualitiesLoading, getQualityById } = useQualities();

  const handleChange = (target) => {
    setErrors({});
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  const transformData = (data) => {
    return data.map((qual) => ({
      label: qual.name,
      value: qual._id
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    if (!qualitiesLoading && !professionsLoading) {
      setData({
        ...currentUser,
        qualities: transformData(currentUser.qualities.map((q) => getQualityById(q)))
      });
      setIsLoading(false);
    }
  }, [qualitiesLoading, professionsLoading]);

  useEffect(() => {
    if (data && isLoading) {
      setIsLoading(false);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const { qualities } = data;
    updateUser({ ...data, qualities: qualities.map((q) => q.value) }).then(() => {
      history.push(`/users/${currentUser._id}`);
    });
    console.log(history);
  };

  const validatorConfig = {
    email: {
      isRequired: {
        message: '?????????????????????? ?????????? ?????????????????????? ?????? ????????????????????'
      },
      isEmail: {
        message: 'Email ???????????? ??????????????????????'
      }
    },
    name: {
      isRequired: {
        message: '?????????????? ???????? ??????'
      }
    },
    qualities: {
      min: {
        message: '???????????????? ???? ???????????? ???????????? ????????????????',
        value: 1
      }
    }
  };

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="container mt-5">
      <button className="btn btn-primary" onClick={() => history.goBack()}>
        ??????????
      </button>
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!isLoading ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="??????"
                placeholder="?????????????? ??????"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="?????????????????????? ??????????"
                placeholder="?????????????? ?????????????????????? ??????????"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <SelectField
                label="???????????? ???????? ??????????????????"
                defaultOption="Choose..."
                name="profession"
                options={professions}
                onChange={handleChange}
                value={data.profession}
                error={errors.profession}
              />
              <RadioField
                options={[
                  { name: 'Male', value: 'male' },
                  { name: 'Female', value: 'female' },
                  { name: 'Other', value: 'other' }
                ]}
                value={data.sex}
                name="sex"
                onChange={handleChange}
                label="???????????????? ?????? ??????"
              />
              <MultiSelectField
                defaultValue={data.qualities}
                options={transformData(qualities)}
                onChange={handleChange}
                values
                name="qualities"
                label="???????????????? ???????? ????????????????"
                error={errors.qualities}
              />
              <button type="submit" disabled={!isValid} className="btn btn-primary w-100 mx-auto">
                ????????????????
              </button>
            </form>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
