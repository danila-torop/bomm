import './Sidebar.css';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const Sidebar = ({ isVisible, toggleSidebar, handleTableChange }) => {
  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <nav>
        <ul>
          <li>
            <a href="#" onClick={() => handleTableChange("bom")}>Сборочные единицы</a>
          </li>
          <li>
            <a href="#" onClick={() => handleTableChange("part")}>Детали</a>
          </li>
          <li>
            <a href="#" onClick={() => handleTableChange("all")}>Все таблицы</a>
          </li>
          <li>
            <a href="#" onClick={() => handleTableChange("tree")}>Дерево сборки</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  handleTableChange: PropTypes.func.isRequired,
};

export default Sidebar;