import React, { useRef, useEffect } from 'react'
import _ from 'lodash'

export default function AddFolder({ state, setState, vars }) {
	let add_folder_input = useRef()

	useEffect(() => {
		//resets the add folder input value if not clicked within the input field
		function handleExit(e) {
			if (
				e.target.className !== 'current_page_add_folder_input' &&
				e.target.className !== 'current_page_add_folder_input_add'
			) {
				add_folder_input.current.placeholder = 'Add Folder'
				setState.setInput('')
				setState.setRender(['mainSection'])
			}
		}

		document.addEventListener('mousedown', handleExit)
		return () => {
			document.removeEventListener('mousedown', handleExit)
		}
	}, [state.input])

	function handleAddFolder() {
		if (state.input) {
			let newFolders = { ...state.folders }
			let newObj = { ...vars.currentFolder.folders }
			newObj[state.input] = new vars.Folder({
				name: state.input,
				dateCreated: Date.now(),
			})
			let newDirectoryChain = [...vars.directoryChain(), 'folders']
			_.set(newFolders, newDirectoryChain.join('.'), newObj)
			setState.setFolders(newFolders)
			setState.setInput('')
			setState.setRender(['mainSection'])
		}
	}
	useEffect(() => {
		//handles enter button
		function handleEnter(e) {
			if (e.key == 'Enter') {
				handleAddFolder()
			}
		}

		document.addEventListener('keydown', handleEnter)
		return () => {
			document.removeEventListener('keydown', handleEnter)
		}
	}, [state.input])

	return (
		<div class="current_page_add_folder_input_container">
			<p class="current_page_add_folder_input_title">FOLDER TITLE</p>
			<input
				autoFocus
				class="current_page_add_folder_input"
				onChange={(e) => setState.setInput(e.target.value)}
				ref={add_folder_input}
				placeholder="Add Folder"
				type="text"
				value={state.input}></input>
			<p class="current_page_add_folder_input_add" onClick={handleAddFolder}>
				ADD
			</p>
		</div>
	)
}
