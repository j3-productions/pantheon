import React from 'react';
import { useForm } from 'react-hook-form';
import { HomeIcon, PlusIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useKey } from '../components/KeyContext';
import * as Type from '../types/pantheon';
import api from '../api';

interface NavBarProps {
  content: string;
  setContent: (value: string) => void;
}

export const NavBar = ({content, setContent}: NavBarProps) => {
  return (
    <nav>
      <div className="flex flex-row gap-2">
        <button>
          <HomeIcon />
        </button>
        <div className="flex-1 min-w-0 flex flex-row justify-center input-group">
          <input type="text" placeholder="Search..." />
          <button>
            <MagnifyingGlassIcon />
          </button>
        </div>
        <button>
          <Cog6ToothIcon />
        </button>
      </div>
    </nav>
  );
};
