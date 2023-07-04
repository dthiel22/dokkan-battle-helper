import React, { useState, useEffect, useMemo } from 'react'

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import { GET_CHARACTER_WIKI_LINK } from "../../pages/api/queries";

import getCharacterInfo from '../util/grabCharacterInfo';

export default function SingleCharacterSearch({  }) {
  const [newCharacterInput, setNewCharacterInput] = useState('')
  const [characterClean, setCharacterClean] = useState({
    id: '',
    wiki_link: '',
    thumb: '',
    art: '',
    title: '',
    name: '',
    rarity: '',
    type: '',
    cost: '',
    ls_description: '',
    ls_description_eza: '',
    sa_type: '',
    sa_name: '',
    sa_description: '',
    sa_description_eza: '',
    ultra_sa_type: '',
    ultra_sa_name: '',
    ultra_sa_description: '',
    ultra_sa_description_eza: '',
    ps_name: '',
    ps_description: '',
    ps_description_eza: '',
    sa_type_active: '',
    active_skill_name: '',
    active_skill: '',
    active_skill_condition: '',
    active_skill_condition_eza: '',
    transform_type: '',
    transform_condition: '',
    transform_condition_eza: '',
    standby_name: '',
    standby_description: '',
    standby_description_eza: '',
    standby_condition: '',
    standby_condition_eza: '',
    finish_attack_1_name: '',
    finish_attack_1_description: '',
    finish_attack_1_description_eza: '',
    finish_attack_1_condition: '',
    finish_attack_1_condition_eza: '',
    finish_attack_2_name: '',
    finish_attack_2_description: '',
    finish_attack_2_description_eza: '',
    finish_attack_2_condition: '',
    finish_attack_2_condition_eza: '',
    transformed: '',
    transform_to: '',
    transformed_from: '',
    Ki12: '',
    Ki24: '',
    link_skill: '',
    category: '',
    jp_date: '',
    glb_date: '',
    jp_date_eza: '',
    glb_date_eza: '',
})

    function handleNewCharacterSubmit (e) {
      e.preventDefault()
      console.log(newCharacterInput)
      setCharacterClean('')
      setCharacterClean(getCharacterInfo(newCharacterInput))
    }

  return (
    <div className='flex flex-col w-full'>
        <p>CHARACTER INFO FROM WIKI</p>
        <form 
        onSubmit={(e) => handleNewCharacterSubmit(e)}
        className='w-full p-2'>
          <textarea
          className='w-full border border-black' 
          value={newCharacterInput}
          onChange={(e) => setNewCharacterInput(e.target.value)}
          rows={25}
          />
          <button>SUBMIT</button>
        </form>
        <form className="w-full">
          {Object.entries(characterClean).map(([key, value]) => (
            <label className="flex flex-col p-2 border-b-2 border-black" key={key}>
              {key}
              <textarea
                className="w-full p-1 border border-gray-300"
                rows={key === 'id' || key === 'thumb' || key === 'art' || key === 'title' || key === 'name' || key === 'rarity' || key === 'type' || key === 'cost' || key === 'sa_type' || key === 'sa_name' || key === 'ultra_sa_name' || key === 'ps_name' || key === 'active_skill_name' || key === 'transform_type' || key === 'standby_name' || key === 'finish_attack_1_name' || key === 'finish_attack_2_name' || key === 'transformed' || key === 'transform_to' || key === 'transformed_from' || key === 'Ki12' || key === 'Ki24' || key === 'glb_date' || key === 'jp_date' || key === 'glb_date_eza' || key === 'jp_date_eza' ? 1 : 6}
                placeholder="null"
                name={key}
                value={value}
              />
            </label>
          ))}
        </form>
    </div>
  )
}
