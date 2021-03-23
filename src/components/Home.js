import React, { useEffect, useRef, useFocus } from 'react'
import '../styles/home.css'
import menuButton from '../images/menu.svg'
import HomeFolderMenu from './HomeFolderMenu'
import HomeFolderSubMenu from './HomeFolderSubMenu'
import HomeFoldersSettings from './HomeFoldersSettings'
// import RenameInput from './RenameInput'

export default function Home({ state, setState, vars, Folder }) {
	let folder_rename_input = useRef()
	let home_add_folder_input = useRef()
	// let [folder_rename_input, focus_folder_rename_input]=useFocus()

	useEffect(() => {
		function addHomeFolderInputClear(e) {
			if (e.target.className !== 'home_add_folder') {
				setState.setHomeAddFolderInput('')
				if (
					home_add_folder_input &&
					home_add_folder_input.current
					// home_add_folder_input.current.placeholder
				) {
					home_add_folder_input.current.placeholder = 'Add Folder'
				}
			}
		}

		function toggleMenuOff(e) {
			//TOGGLES THE FOLDER MENU OFF
			if (
				e.key !== 'Enter' &&
				e.target.className !== 'home_folder_menu' &&
				e.target.className !== 'home_folder_menu_color' &&
				e.target.className !== 'home_folder_menu_color_option' &&
				e.target.className !== 'home_folder_menu_options' &&
				e.target.className !== 'menuButton home' &&
				e.target.className !== 'home_folder_title_rename_input' &&
				e.target.className !== 'home_folder_delete_confirm' &&
				e.target.className !== 'home_folder_delete_confirm yes' &&
				e.target.className !== 'home_folder_delete_confirm no' &&
				e.target.className !== 'home_rename_folder_input_error' &&
				e.target.className !== 'testbutton'
			) {
				//TO KEEP
				let newHome = { ...state.home, toggleHomeFolderMenu: null, homeRenameFolderInput: null }
				setState.setHome(newHome)
				//TO DELETE
				setState.setToggleHomeFolderMenu(null)
				setState.setHomeRenameFolderInput('')
				//
			}
		}

		function enterInput(e) {
			//SUBMITS TEXT OF CREATE HOME FOLDER INPUT
			if (
				//HOME FOLDER ENTER INPUT
				e.key == 'Enter' &&
				state.homeAddFolderInput &&
				!state.folders[state.homeAddFolderInput]
			) {
				let newObj = { ...state.folders }
				newObj[state.homeAddFolderInput] = new Folder({
					name: state.homeAddFolderInput,
					dateCreated: Date.now(),
				})

				setState.setFolders(newObj)
				setState.setHomeAddFolderInput('')
				if (home_add_folder_input && home_add_folder_input.current) {
					home_add_folder_input.current.placeholder = 'Add Folder'
				}
			}
			if (
				//RENAME FOLDER INPUT
				e.key == 'Enter' &&
				!state.folders[state.homeRenameFolderInput] &&
				//TO KEEP
				// state.home.toggleHomeFolderMenu
				//TO DELETE
				state.toggleHomeFolderMenu
			) {
				let newFolders = { ...state.folders }
				newFolders[state.toggleHomeFolderMenu[0]].name =
					state.homeRenameFolderInput
				newFolders[state.homeRenameFolderInput] =
					newFolders[state.toggleHomeFolderMenu[0]]
				delete newFolders[state.toggleHomeFolderMenu[0]]
				state.homeRenameFolderInput = null
				setState.setFolders(newFolders)
				//TO KEEP
				let newHome = { ...state.home, toggleHomeFolderMenu: null }
				setState.setHome(newHome)
				//TO DELETE
				setState.setToggleHomeFolderMenu('')
			}
		}
		document.addEventListener('mousedown', addHomeFolderInputClear)
		document.addEventListener('mousedown', toggleMenuOff)
		document.addEventListener('keydown', enterInput)
		return () => {
			document.removeEventListener('mousedown', addHomeFolderInputClear)
			document.removeEventListener('mousedown', toggleMenuOff)
			document.removeEventListener('keydown', enterInput)
		}
	})

	let homeFolders = () => {
		//HOME FOLDERS

		let foldersArray = () => {
			let newFoldersArray = []
			Object.keys(state.folders).map((item) => {
				newFoldersArray.push(state.folders[item])
			})
			//SORTS ARRAY
			if (vars.homeFoldersSort == 'RECENT') {
				console.log('recent sort')
				return newFoldersArray
					.sort((a, b) => {
						return a['lastSelected'] - b['lastSelected']
					})
					.reverse()
			} else if (vars.homeFoldersSort == 'DATE CREATED'||!vars.homeFoldersSort) {
				console.log('date sort')
				return newFoldersArray.sort((a, b) => {
					return a['dateCreated'] - b['dateCreated']
				})
			} else if (vars.homeFoldersSort == 'NAME') {
				console.log('name sort')
				return newFoldersArray.sort((a, b) => {
					if (a['name'] < b['name']) {
						return -1
					}
					if (a['name'] > b['name']) {
						return 1
					}
					return 0
				})
			}
		}
		if (foldersArray().length > 0) {
			return foldersArray().map((item) => {
				let newArr = [item.name]

				let insideFolder = () => {
					if (
						state.toggleHomeFolderMenu && // FOLDER TITLE AREA
						state.toggleHomeFolderMenu[0] == item.name &&
						state.toggleHomeFolderMenu[1] == 'rename'
					) {
						return (
							//CANT GET THIS INPUT TO AUTO FOCUS!?!??!
							<>
								<input
									onChange={(e) =>
										setState.setHomeRenameFolderInput(
											e.target.value.toLowerCase()
										)
									}
									value={state.homeRenameFolderInput}
									// autofocus="true"
									// autoFocus
									// autofocus='true'
									// autoFocus={true}
									// autofocus={ true}
									ref={folder_rename_input}
									class="home_folder_title_rename_input"
									type="text"
									style={{ color: 'black' }}></input>
								{/* MY ATTEMPTS SO FAR */}
								{/* <button class='testbutton' onClick={()=> folder_rename_input.current.focus()}>FOCUS</button> */}
								{/* {console.log('focus')} */}
								{/* {folder_rename_input&&folder_rename_input.current&&folder_rename_input.current.focus()} */}
								{/* {folder_rename_input && folder_rename_input.current && console.log('focus')}
								{folder_rename_input && console.log(folder_rename_input)} */}
								{/* {folder_rename_input&&folder_rename_input.current.focus()} */}
								{state.folders[state.homeRenameFolderInput] && (
									<p class="home_rename_folder_input_error">
										Sorry, this name already exists!
									</p>
								)}
							</>
						)
					} else if (
						state.toggleHomeFolderMenu && // FOLDER TITLE AREA
						state.toggleHomeFolderMenu[0] == item.name &&
						state.toggleHomeFolderMenu[1] == 'delete'
					) {
						return (
							<div class="home_folder_delete_confirm">
								<p
									class="home_folder_delete_confirm yes"
									onMouseDown={() => {
										let newArr = [...state.toggleHomeFolderMenu]
										newArr[2] = 'yes'
										//TO KEEP
										let newHome = { ...state.home, toggleHomeFolderMenu: newArr }
										setState.setHome(newHome)
										//TO DELETE
										setState.setToggleHomeFolderMenu(newArr)
									}}>
									YES
								</p>
								<p
									class="home_folder_delete_confirm no"
									onMouseDown={() => {
										//TO KEEP
										let newHome = { ...state.home, toggleHomeFolderMenu: null }
										setState.setHome(newHome)
										//TO DELETE
										setState.setToggleHomeFolderMenu(null)
									}}>
									/ NO
								</p>
							</div>
						)
					} else {
						return (
							<h3 class="home_folder_title">
								{state.folders[item.name].name.toUpperCase()}
							</h3>
						)
					}
				}

				return (
					<div //HOME FOLDER
						class="home_folder"
						onMouseDown={(e) => {
							if (
								// IDENTIFIES WHAT IS BEING CLICKED WITHIN FOLDER
								e.target.className == 'home_folder' ||
								e.target.className == 'home_folder_title'
							) {
								if (!state.toggleHomeFolderMenu) {
									//ENSURES THE MENU ISNT OPEN
									let newArr = [item.name]
									setState.setDirectory(newArr) //ADDS TO DIRECTORY IN STATE WHICH LOADS NEW FOLDER
									let newFolders = { ...state.folders }
									newFolders[item.name].lastSelected = Date.now() //ADDS NEW DATE TO VALUE OF 'lastSelected' PROPERTY
									newFolders[item.name].timesSelected =
										+newFolders[item.name].timesSelected + 1 //ADDS TO VALUE TO 'timesSelected' PROPERTY
									setState.setFolders(newFolders)
								}
							} else if (e.target.className == 'menuButton home') {
								//TO KEEP
								let newHome = { ...state.home, toggleHomeFolderMenu: [item.name] }
								setState.setHome(newHome)
								//TO DELETE
								setState.setToggleHomeFolderMenu([item.name]) //TOGGLES THE FOLDER MENU
							}
						}}
						style={{
							//STYLING
							border: '5px ' + state.folders[item.name].folderColor + ' solid',
						}}>
						{insideFolder()}

						<img class="menuButton home" src={menuButton} />

						{state.toggleHomeFolderMenu &&
							item.name == state.toggleHomeFolderMenu[0] &&
							state.toggleHomeFolderMenu[1] !== 'rename' && ( //LOADS THE FOLDER MENU AND SUB MENU
								<HomeFolderMenu
									folder={item.name}
									state={state}
									setState={setState}
									vars={vars}
								/>
							)}
						{state.toggleHomeFolderMenu &&
							item.name == state.toggleHomeFolderMenu[0] &&
							state.toggleHomeFolderMenu[1] &&
							state.toggleHomeFolderMenu[1] !== 'rename' && (
								<HomeFolderSubMenu
									folder={item.name}
									state={state}
									setState={setState}
									vars={vars}
								/>
							)}
					</div>
				)
			})
		} else {
			return (
				<div>
					<h3>NO FOLDERS</h3>
				</div>
			)
		}
	}

	let homeFolderErrorMessage = () => {
		if (state.folders[state.homeAddFolderInput]) {
			return (
				<p class="home_add_folder_input_error">
					Sorry.. this folder already exists!
				</p>
			)
		}
	}
	// console.log('hello')
	let addFolderInput = (
		<>
			<div class="home_add_folder_container">
				{homeFolderErrorMessage()}
				<input
					ref={home_add_folder_input}
					// onMouseDown={(e)=>{e.target.placeholder=''} }
					onMouseDown={(e) => {
						if (home_add_folder_input && home_add_folder_input.current) {
							home_add_folder_input.current.placeholder = ''
						}
					}}
					onChange={(e) =>
						setState.setHomeAddFolderInput(e.target.value.toLowerCase())
					}
					class="home_add_folder"
					value={state.homeAddFolderInput.toLowerCase()}
					type="text"
					placeholder="Add Folder"></input>
			</div>
		</>
	)
	// console.log(state.homeFoldersSettings,'homeFoldersSettings',state.sortHomeFolders,'sortHomeFolders')
	return (
		<div class="home">
			<div class="home_header">{addFolderInput}</div>
			<img
				onMouseDown={() => setState.setHomeFoldersSettings([])}
				class="home_folder_settings_button"
				src={menuButton}
				style={{ cursor: 'pointer' }}
			/>
			{!state.homeFoldersSettings && homeFolders()}
			{state.homeFoldersSettings && (
				<HomeFoldersSettings state={state} setState={setState} vars={vars} />
			)}
		</div>
	)
}
