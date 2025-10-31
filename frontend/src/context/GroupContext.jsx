import React, { createContext, useState, useContext } from 'react';

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () => {
        // Fetch groups from API
    };

    const createGroup = async (groupData) => {
        // Create new group
    };

    const updateGroup = async (groupId, groupData) => {
        // Update existing group
    };

    const deleteGroup = async (groupId) => {
        // Delete group
    };

    return (
        <GroupContext.Provider value={{
            groups,
            selectedGroup,
            setSelectedGroup,
            fetchGroups,
            createGroup,
            updateGroup,
            deleteGroup
        }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroup = () => useContext(GroupContext);
