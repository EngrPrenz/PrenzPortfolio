export interface Hobby {
  id: string
  title: string
  category: string
  icon: string
  description: string
  tags: string[]
  imageUrl?: string
  featured?: boolean
  displayOrder?: number
}
