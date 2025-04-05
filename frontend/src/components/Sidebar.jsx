import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import RepoItem from "./RepoItem";
import {} from "react-icons";
import { UserButton } from "@clerk/clerk-react";
import { Button, Input, Modal, Spin } from "antd";
import { useState } from "react";

import axios from "axios";
import useStore from "../../store/auth.store.js";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isGitHubAuth, isGitHubLoading, setIsGitHubAuth, setIsGitHubLoading } =
    useStore();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkGitHubAuth = async () => {
    try {
      setIsGitHubLoading(true);
      const res = await axios.get("http://localhost:3000/auth/check-token", {
        withCredentials: true,
      });
      setIsGitHubAuth(true);
      setIsGitHubLoading(false);
    } catch (err) {
      setIsGitHubAuth(false);
      setIsGitHubLoading(false);
    } finally {
      setIsGitHubLoading(false);
    }
  };

  useEffect(() => {
    checkGitHubAuth();
  }, []);

  if (isGitHubLoading) {
    return (
      <div className="text-white h-screen w-[270px] bg-[#1d1e30] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // const handleGithubLogin = async () => {
  //   console.log('jnhb');

  //   try {
  //     const res = await axios.get("http://localhost:3000/auth/login", {
  //       withCredentials: true,
  //     });
  //     checkGitHubAuth();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23litfPo6lKS1pVrGY&redirect_uri=http://localhost:3000/auth/github/callback&scope=read:user repo`;
    checkGitHubAuth();
  };

  return (
    <div className="text-white h-screen w-[270px] bg-[#1d1e30] pt-4 px-3">
      <div className="flex gap-3 justify-start items-end text-2xl mb-5">
        <img src={logo} alt="" className="w-8" />
        <p>PRism</p>
      </div>
      {isGitHubAuth ? (
        <div>
          <button
            className="w-full bg-[#5866f2] flex justify-center py-4 rounded-xl mx-auto cursor-pointer active:bg-[#4854d9]"
            onClick={() => showModal()}
          >
            Add Repository
          </button>
          <div>
            <div className="pt-8 text-md poppins-thin ml-1 mb-2">
              Repositories
            </div>
            <div className="">
              <RepoItem name={"Repo 1"} />
              <RepoItem name={"Repo 2"} />
              <RepoItem name={"Repo 3"} />
              <RepoItem name={"Repo 4"} />
            </div>
          </div>
          <Modal
            title="Add Repository Link"
            open={isModalOpen}
            centered
            onCancel={handleCancel}
            classNames={"!bg-[#1d1e30]"}
          >
            <Input />
          </Modal>
        </div>
      ) : (
        <button
          className={`w-full bg-[#5866f2] flex justify-center py-4 rounded-xl mx-auto cursor-pointer active:bg-[#4854d9]`}
          onClick={() => handleGithubLogin()}
        >
          LogIn with Github
        </button>
      )}
    </div>
  );
};

export default Sidebar;
