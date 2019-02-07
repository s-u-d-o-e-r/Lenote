import React, { useState, useEffect, useRef, createRef } from 'react'
import styled from 'styled-components'

const Container = styled.div`
	position: relative;
`

const OptionsWrapper = styled.div`
	position: absolute;
	top: 100%;
	display: ${props => (props.visible ? 'block' : 'none')};
`

export const OpenMenu = () => null

const Menu = ({
	children,
	ContainerTag = Container,
	OptionsContainer = 'div',
	value,
	onChange = () => {},
	onOpen = () => {},
}) => {
	const clickAwayRef = useRef(createRef())
	const [isMenuOpen, setMenuOpen] = useState(false)

	const toggleMenu = () => {
		if (isMenuOpen) {
			setMenuOpen(false)
		} else {
			onOpen()
			setMenuOpen(true)
		}
	}
	const open = children.find(child => child.type === OpenMenu)
	const options = children.filter(child => child.type !== OpenMenu)

	const hideOnClickAway = event => {
		if (!event.path.some(el => el === clickAwayRef.current)) {
			setMenuOpen(false)
		}
	}

	useEffect(() => {
		window.addEventListener('click', hideOnClickAway)
		return () => window.removeEventListener('click', hideOnClickAway)
	}, [])

	return (
		<ContainerTag onClick={() => toggleMenu()} ref={clickAwayRef}>
			{open && open.props.children}
			<OptionsWrapper visible={isMenuOpen}>
				<OptionsContainer onClick={e => e.stopPropagation()}>
					{options &&
						React.Children.map(options, option =>
							React.cloneElement(option, {
								onClick: e => onChange(option.props.value, e),
								...option.props,
							})
						)}
				</OptionsContainer>
			</OptionsWrapper>
		</ContainerTag>
	)
}

export default Menu
