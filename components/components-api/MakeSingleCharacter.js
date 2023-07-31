import React, { useState, useEffect, useMemo } from "react";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import { ADD_CHARACTER } from "../util/mutations";

import getCharacterInfo from "../util/grabCharacterInfo";

export default function MakeSingleCharacter({characterForm, setCharacterForm}) {
  const [addCharacter, { error: addCharacterError, data: addCharacterData }] =
    useMutation(ADD_CHARACTER);
  const [turnOnMutation, setTurnOnMutation] = useState(false);

  const [newCharacterInput, setNewCharacterInput] = useState("");

  function characterFormChange(e) {
    e.preventDefault();
    console.log(newCharacterInput);
    setCharacterForm(getCharacterInfo(newCharacterInput));
  }

  function handleCharacterInputChange(e) {
    let value = e.target.value;
    if (value === "") {
      value = null;
    }
    setCharacterForm({
      ...characterForm,
      [e.target.name]: value,
    });
  }

  async function handleAddCharacter(e) {
    e.preventDefault();

    let transformToArray = null;

    if (characterForm.transform_to) {
      if (characterForm.transform_to.includes(',')) {
        transformToArray = characterForm.transform_to.split(',').map(Number);
      } else {
        transformToArray = [parseInt(characterForm.transform_to, 10)];
      }
    }

    // Convert the required values to integers
    const formattedCharacter = {
      ...characterForm,
      id: parseInt(characterForm.id) || null,
      art: parseInt(characterForm.art) || null,
      thumb: parseInt(characterForm.thumb),
      cost: parseInt(characterForm.cost),
      transformed: characterForm.transformed === "true" && true || characterForm.transformed === "false" && false,
      transform_to: transformToArray,
      transformed_from: characterForm.transformed_from ? parseInt(characterForm.transformed_from) : null,
      Ki12: characterForm.Ki12 ? parseInt(characterForm.Ki12) : null,
      Ki24: characterForm.Ki24 ? parseInt(characterForm.Ki24) : null,
      link_skill: Array.isArray(characterForm.link_skill) ? characterForm.link_skill : characterForm.link_skill.split(','),
      category: Array.isArray(characterForm.category) ? characterForm.category : characterForm.category.split(',')
    };

    console.log(formattedCharacter);
    console.log(formattedCharacter.link_skill);
    console.log(formattedCharacter.category);
    console.log("---------------");

    turnOnMutation
      ? await addCharacter({
          variables: {
            character: {
              wiki_link: formattedCharacter?.wiki_link,
              id: formattedCharacter?.id,
              thumb: formattedCharacter?.thumb,
              art: formattedCharacter?.art,
              name: formattedCharacter?.name,
              title: formattedCharacter?.title,
              rarity: formattedCharacter?.rarity,
              type: formattedCharacter?.type,
              cost: formattedCharacter?.cost,
              ls_description: formattedCharacter?.ls_description,
              ls_description_eza: formattedCharacter?.ls_description_eza,
              sa_type: formattedCharacter?.sa_type,
              sa_name: formattedCharacter?.sa_name,
              sa_description: formattedCharacter?.sa_description,
              sa_description_eza: formattedCharacter?.sa_description_eza,
              ultra_sa_type: formattedCharacter?.ultra_sa_type,
              ultra_sa_name: formattedCharacter?.ultra_sa_name,
              ultra_sa_description: formattedCharacter?.ultra_sa_description,
              ultra_sa_description_eza: formattedCharacter?.ultra_sa_description_eza,
              ps_name: formattedCharacter?.ps_name,
              ps_description: formattedCharacter?.ps_description,
              ps_description_eza: formattedCharacter?.ps_description_eza,
              sa_type_active: formattedCharacter?.sa_type_active,
              active_skill_name: formattedCharacter?.active_skill_name,
              active_skill: formattedCharacter?.active_skill,
              active_skill_condition: formattedCharacter?.active_skill_condition,
              active_skill_condition_eza: formattedCharacter?.active_skill_condition_eza,
              transform_type: formattedCharacter?.transform_type,
              transform_condition: formattedCharacter?.transform_condition,
              transform_condition_eza: formattedCharacter?.transform_condition_eza,
              standby_name: formattedCharacter?.standby_name,
              standby_description: formattedCharacter?.standby_description,
              standby_description_eza: formattedCharacter?.standby_description_eza,
              standby_condition: formattedCharacter?.standby_condition,
              standby_condition_eza: formattedCharacter?.standby_condition_eza,
              finish_attack_1_name: formattedCharacter?.finish_attack_1_name,
              finish_attack_1_description: formattedCharacter?.finish_attack_1_description,
              finish_attack_1_description_eza: formattedCharacter?.finish_attack_1_description_eza,
              finish_attack_1_condition: formattedCharacter?.finish_attack_1_condition,
              finish_attack_1_condition_eza: formattedCharacter?.finish_attack_1_condition_eza,
              finish_attack_2_name: formattedCharacter?.finish_attack_2_name,
              finish_attack_2_description: formattedCharacter?.finish_attack_2_description,
              finish_attack_2_description_eza: formattedCharacter?.finish_attack_2_description_eza,
              finish_attack_2_condition: formattedCharacter?.finish_attack_2_condition,
              finish_attack_2_condition_eza: formattedCharacter?.finish_attack_2_condition_eza,
              transformed: formattedCharacter?.transformed,
              transform_to: formattedCharacter?.transform_to,
              transformed_from: formattedCharacter?.transformed_from,
              Ki12: formattedCharacter?.Ki12,
              Ki24: formattedCharacter?.Ki24,
              link_skill: formattedCharacter?.link_skill,
              category: formattedCharacter?.category,
              jp_date: formattedCharacter?.jp_date,
              glb_date: formattedCharacter?.glb_date,
              jp_date_eza: formattedCharacter?.jp_date_eza,
              glb_date_eza: formattedCharacter?.glb_date_eza,
            },
          },
        })
          .then((results) => {
            console.log(results);
          })
          .catch((error) => {
            console.log(error);
          })
      : console.log("mutation is off");
  }

  return (
    <div className="flex flex-col w-full">
      <p>CHARACTER INFO FROM WIKI</p>
      <form onChange={(e) => characterFormChange(e)} className="w-full p-2">
        <textarea
          className="w-full border border-black"
          value={newCharacterInput}
          onChange={(e) => setNewCharacterInput(e.target.value)}
          rows={25}
        />
      </form>
      <form onSubmit={(e) => handleAddCharacter(e)} className="w-full">
        {Object.entries(characterForm).map(([key, value]) => (
            <label className="flex flex-row p-2 border-b-2 border-black" key={key}>
              {key}
              <textarea
                className="w-full p-1 border border-gray-300"
                rows={key === 'id' || key === 'thumb' || key === 'art' || key === 'title' || key === 'name' || key === 'rarity' || key === 'type' || key === 'cost' || key === 'sa_type' || key === 'sa_name' || key === 'ultra_sa_name' || key === 'ps_name' || key === 'active_skill_name' || key === 'transform_type' || key === 'standby_name' || key === 'finish_attack_1_name' || key === 'finish_attack_2_name' || key === 'transformed' || key === 'transform_to' || key === 'transformed_from' || key === 'Ki12' || key === 'Ki24' || key === 'glb_date' || key === 'jp_date' || key === 'glb_date_eza' || key === 'jp_date_eza' 
                ? 1 : 3}
                placeholder="null"
                name={key}
                value={characterForm[key]}
                onChange={handleCharacterInputChange}
              />
            </label>
          ))}

        <button className="w-full my-2 bg-orange-200 border-2 border-black">SUBMIT</button>
      </form>
      <button
        onClick={() => setTurnOnMutation(!turnOnMutation)}
        className={`p-5 ${turnOnMutation ? "bg-green-400" : "bg-red-200"}`}
      >
        {turnOnMutation
          ? "MUTATION IS CURRENTLY ON"
          : "MUTATION IS CURRENTLY OFF"}
      </button>
    </div>
  );
}
