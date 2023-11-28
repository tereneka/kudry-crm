import React from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className='navigation'>
      <NavLink
        className={({ isActive }) =>
          `navigation__link ${
            isActive
              ? 'navigation__link_active'
              : ''
          }`
        }
        to='/planner'>
        планер
      </NavLink>
    </nav>
  );
}
