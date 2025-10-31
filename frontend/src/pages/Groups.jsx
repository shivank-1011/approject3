import React, { useEffect } from 'react';
import { useGroup } from '../context/GroupContext';
import GroupCard from '../components/GroupCard';
import '../styles/Groups.css';

const Groups = () => {
    const { groups, fetchGroups, createGroup } = useGroup();

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreateGroup = () => {
        // Open modal or form to create new group
    };

    return (
        <div className="groups-page">
            <div className="groups-header">
                <h1>Groups</h1>
                <button onClick={handleCreateGroup}>Create Group</button>
            </div>
            <div className="groups-grid">
                {groups.map(group => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default Groups;
