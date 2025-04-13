/* eslint-disable react/prop-types */
import '../style/groupcard.css';

const GroupCard = ({ name, university, description, students, onClick }) => {
  return (
    <div className="group-card" onClick={onClick}>
      <div className="group-header">
        <h5>{name}</h5>
        <span>{students} students</span>
      </div>
      <p className="group-desc">{description}</p>
      <p className="group-university">{university}</p>
    </div>
  );
};

export default GroupCard;
