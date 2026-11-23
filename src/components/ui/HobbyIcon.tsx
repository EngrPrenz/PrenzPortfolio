import React from 'react'
import {
  Cpu,
  GameController,
  Cube,
  Camera,
  MusicNotes,
  Wrench,
  Globe,
  DeviceMobile,
  Guitar,
  Motorcycle,
  Sparkle,
} from '@phosphor-icons/react'

interface HobbyIconProps {
  name: string
  size?: number
  className?: string
}

export const HobbyIcon: React.FC<HobbyIconProps> = ({
  name,
  size = 20,
  className = 'text-[var(--accent)]',
}) => {
  const iconProps = { size, 'aria-hidden': true as const, className }

  switch (name) {
    case 'Cpu':
    case 'Circuitry':
      return <Cpu {...iconProps} />
    case 'GameController':
      return <GameController {...iconProps} />
    case 'Cube':
      return <Cube {...iconProps} />
    case 'Wrench':
      return <Wrench {...iconProps} />
    case 'Camera':
      return <Camera {...iconProps} />
    case 'MusicNotes':
      return <MusicNotes {...iconProps} />
    case 'Guitar':
      return <Guitar {...iconProps} />
    case 'Motorcycle':
      return <Motorcycle {...iconProps} />
    case 'Globe':
      return <Globe {...iconProps} />
    case 'DeviceMobile':
      return <DeviceMobile {...iconProps} />
    default:
      if (name && name.length <= 4) {
        return (
          <span aria-hidden="true" className="text-base leading-none">
            {name}
          </span>
        )
      }
      return <Sparkle {...iconProps} />
  }
}
