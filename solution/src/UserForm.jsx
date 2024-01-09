import { useState, useEffect } from 'react';
import { isNameValid, getLocations } from './mock-api/apis';

export const UserForm = () => {
  const [error, setError] = useState({ name: '', location: '' });
  const [locations, setLocations] = useState(['']);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const result = await getLocations();

        // set locations
        setLocations(['', ...result]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // get locations
    void fetchLocations();
  }, []);

  const handleReset = (e) => {
    e.preventDefault();

    // reset fields and error state
    setName('');
    setLocation('');
    setError({ name: '', location: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validating name is present for api validation purposes
    if (!name) {
      setError({ ...error, name: 'please enter a name' });

      return;
    }

    // validating location is present for api validation purposes
    if (!location) {
      setError({ name: '', location: 'please enter a location' });

      return;
    }

    // set loading to indicate to user process has started
    setLoading(true);

    // checking if name exists
    const isNameOk = await isNameValid(name);

    // reset loading to indicate to user that the process has ended
    setLoading(false);

    if (!isNameOk) {
      setError({ location: '', name: 'name is already taken, please try another' });

      return;
    }

    // reset error state to correctly prompt user of relevant errors
    setError({ name: '', location: '' });

    // add user user to table
    setUsers([...users, { name, location }]);

    // reset fields so user can make more entrie
    setName('');
    setLocation('');
  };

  return (
    <div className='page'>
      <form className='user-form' onSubmit={handleSubmit}>
        <div id='name-input' className='form-element'>
          <span className='field-label'>Name</span>
          <div className='input-field'>
            <input
              className='name-input'
              placeholder='type name here'
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            {error.name && <span className='error-text'>{error.name}</span>}
          </div>
        </div>
        <div id='location-input' className='form-element'>
          <span className='field-label'>Location</span>
          <div className='input-field'>
            <select className='location-input' onChange={(e) => setLocation(e.currentTarget.value)} value={location}>
              <option value='' disabled hidden>
                Select Location
              </option>
              {locations.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error.location && <span className='error-text'>{error.location}</span>}
          </div>
        </div>
        <div className='buttons-container'>
          <button onClick={handleReset}>Clear</button>
          <button type='submit'>Add</button>
        </div>
      </form>
      <h4>Users</h4>
      <div className='table-container'>
        <table className='users-table'>
          <thead>
            <tr className='table-row'>
              <th>name</th>
              <th>location</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>Loading...</tr>
            ) : users.length ? (
              users.map(({ name, location }, i) => (
                <tr className='table-row' style={{ backgroundColor: i % 2 === 0 ? 'white' : 'lightgray' }}>
                  <td>{name}</td>
                  <td>{location}</td>
                </tr>
              ))
            ) : (
              <tr>No Users</tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
