import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import { EDIT_CHARACTER } from "../util/mutations";
import { update } from 'lodash';
import { updateEdge } from 'reactflow';


export default function EditCharacter({ characterForm, setCharacterForm }) {
    const [editCharacter,{ error: editCharacterError, data: editCharacterData }] = useMutation(EDIT_CHARACTER);
    const [turnOnMutation, setTurnOnMutation] = useState(false)
    
      function handleCharacterEditInputChange(e) {
        let value = e.target.value
        if (value === ''){
          value = null
        }
        setCharacterForm({
          ...characterForm,
          [e.target.name]: value,
        });
      }
      
      async function editCharacterSubmit(e) {
        e.preventDefault();
        // Check if any values are empty strings and replace them with null
        const updatedCharacter = {};

        Object.entries(characterForm).forEach(([key, value]) => {
          updatedCharacter[key] = value === '' ? null : value;
        });

        let transformToArray = null;

        if (updatedCharacter.transform_to) {
          if (updatedCharacter.transform_to.includes(',')) {
            transformToArray = updatedCharacter.transform_to.split(',').map(Number);
          } else {
            transformToArray = [parseInt(updatedCharacter.transform_to, 10)];
          }
        }

        const formattedCharacter = {
          ...updatedCharacter,
          transformed: updatedCharacter.transformed === "true" && true || updatedCharacter.transformed === "false" && false,
          transform_to: transformToArray,
          transformed_from: updatedCharacter.transformed_from ? parseInt(updatedCharacter.transformed_from) : null,
          Ki12: parseInt(updatedCharacter.Ki12),
          Ki24: parseInt(updatedCharacter.Ki24),
          link_skill: Array.isArray(updatedCharacter.link_skill) ? updatedCharacter.link_skill : updatedCharacter.link_skill.split(','),
          category: Array.isArray(updatedCharacter.category) ? updatedCharacter.category : updatedCharacter.category.split(',')
        }
        
        console.log('------------------')
        console.log('character object:')
        console.log(formattedCharacter)
        console.log('transformed:')
        console.log(formattedCharacter.transformed)
        console.log('link skills:')
        console.log(formattedCharacter.link_skill)
        console.log('category:')
        console.log(formattedCharacter.category)
        console.log('------------------')
        
        turnOnMutation ?
          await editCharacter({
            variables: {
              updatedCharacter: formattedCharacter,
            },
          })
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          })
        :
          console.log('mutation is turned off')
      }

  return (
    <div className='flex flex-col w-full'>
      <form onSubmit={(e) => editCharacterSubmit(e)} className="w-full">
        {Object.entries(characterForm).map(([key, value]) => (
          <label className="flex flex-col p-2 border-b-2 border-black" key={key}>
            {key}
            <textarea
              className="w-full p-1 border border-gray-300"
              rows={key === 'id' || key === 'thumb' || key === 'art' || key === 'title' || key === 'name' || key === 'rarity' || key === 'type' || key === 'cost' || key === 'sa_type' || key === 'sa_name' || key === 'ultra_sa_name' || key === 'ps_name' || key === 'active_skill_name' || key === 'transform_type' || key === 'standby_name' || key === 'finish_attack_1_name' || key === 'finish_attack_2_name' || key === 'transformed' || key === 'transform_to' || key === 'transformed_from' || key === 'Ki12' || key === 'Ki24' || key === 'glb_date' || key === 'jp_date' || key === 'glb_date_eza' || key === 'jp_date_eza' ? 1 : 6}
              placeholder="null"
              name={key}
              value={characterForm[key]}
              onChange={handleCharacterEditInputChange}
            />
          </label>
        ))}

        <button
        className='w-full my-2 bg-orange-200 border-2 border-black'
        >SUBMIT</button>
      </form>
      <button 
      onClick={() => setTurnOnMutation(!turnOnMutation)}
      className={`p-5 ${turnOnMutation ? 'bg-green-400' : 'bg-red-200'}`}>{turnOnMutation ? 'MUTATION IS CURRENTLY ON' : 'MUTATION IS CURRENTLY OFF'}</button>
    </div>
  );
}