import { ActionDelete, ActionEdit, ActionView } from "../../components/Action";
import Button from "../../components/Button/Button";
import { Table } from "../../components/Table";
import DashboardHeading from "../DashboardHeading";
import React, { useEffect, useState } from "react";
import { LabelStatus } from "../../components/label";

const CategoryManage = () => {
  useEffect(() => {
    document.title = "Category Manage";
  }, []);

  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button kind="ghost" height="60px" to="/manage/add-category">
          Create category
        </Button>
      </DashboardHeading>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2z5tiKxo2pQLck9IvU8K</td>
            <td>Streamer</td>
            <td>
              <em className="text-gray-400">streamer</em>
            </td>
            <td>
              {/* {category.status === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {category.status === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )} */}
              <LabelStatus type="success">Approved</LabelStatus>
            </td>
            <td>
              <div className="flex gap-5 text-gray-400">
                <ActionView></ActionView>
                {}
                <ActionEdit
                  // onClick={() =>
                  //   navigate(`/manage/update-category?id=${category.id}`)
                  // }
                ></ActionEdit>
                <ActionDelete
                  // onClick={() => handleDeleteCategory(category.id)}
                ></ActionDelete>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* {total > categories.length && (
        <div className="mt-10">
          <Button onClick={handleLoadMoreCategory} className="mx-auto">
            Load More
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default CategoryManage;
