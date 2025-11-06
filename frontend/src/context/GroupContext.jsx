import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const GroupContext = createContext(null);

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchGroups = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/groups");

      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setError(err.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name) => {
    try {
      setError(null);
      const response = await api.post("/groups", { name });

      if (response.data.success) {
        const newGroup = response.data.data;
        setGroups((prevGroups) => [newGroup, ...prevGroups]);
        return { success: true, data: newGroup };
      }

      return { success: false, message: "Failed to create group" };
    } catch (err) {
      console.error("Failed to create group:", err);
      const message = err.response?.data?.message || "Failed to create group";
      setError(message);
      return { success: false, message };
    }
  };

  const getGroupById = async (groupId) => {
    try {
      setError(null);
      const response = await api.get(`/groups/${groupId}`);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to fetch group" };
    } catch (err) {
      console.error("Failed to fetch group:", err);
      const message = err.response?.data?.message || "Failed to fetch group";
      setError(message);
      return { success: false, message };
    }
  };

  const joinGroup = async (groupId) => {
    try {
      setError(null);
      const response = await api.post(`/groups/${groupId}/join`);

      if (response.data.success) {
        await fetchGroups();
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to join group" };
    } catch (err) {
      console.error("Failed to join group:", err);
      const message = err.response?.data?.message || "Failed to join group";
      setError(message);
      return { success: false, message };
    }
  };

  const joinGroupByCode = async (joinCode) => {
    try {
      setError(null);
      const response = await api.post(`/groups/join-by-code`, { joinCode });

      if (response.data.success) {
        await fetchGroups();
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to join group" };
    } catch (err) {
      console.error("Failed to join group:", err);
      const message = err.response?.data?.message || "Failed to join group";
      setError(message);
      return { success: false, message };
    }
  };

  const addMemberToGroup = async (groupId, email) => {
    try {
      setError(null);
      const response = await api.post(`/groups/${groupId}/members`, { email });

      if (response.data.success) {
        await fetchGroups();
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to add member" };
    } catch (err) {
      console.error("Failed to add member:", err);
      const message = err.response?.data?.message || "Failed to add member";
      setError(message);
      return { success: false, message };
    }
  };

  const removeMemberFromGroup = async (groupId, memberId) => {
    try {
      setError(null);
      const response = await api.delete(`/groups/${groupId}/members/${memberId}`);

      if (response.data.success) {
        await fetchGroups();
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to remove member" };
    } catch (err) {
      console.error("Failed to remove member:", err);
      const message = err.response?.data?.message || "Failed to remove member";
      setError(message);
      return { success: false, message };
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      setError(null);
      const response = await api.delete(`/groups/${groupId}`);

      if (response.data.success) {
        setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
        return { success: true, data: response.data.data };
      }

      return { success: false, message: "Failed to delete group" };
    } catch (err) {
      console.error("Failed to delete group:", err);
      const message = err.response?.data?.message || "Failed to delete group";
      setError(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setGroups([]);
    }
  }, [isAuthenticated]);

  const value = {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    getGroupById,
    joinGroup,
    joinGroupByCode,
    addMemberToGroup,
    removeMemberFromGroup,
    deleteGroup,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};

export default GroupContext;