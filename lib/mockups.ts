export interface MockupVariant {
  id: string
  label: string
  filename: string
  colorSlug: string
}

export const MOCKUP_VARIANTS: MockupVariant[] = [
  { id: 'black',         label: 'Black',          filename: '/mockups/black.jpg',         colorSlug: 'black' },
  { id: 'charcoal',      label: 'Charcoal',       filename: '/mockups/charcoal.jpg',      colorSlug: 'charcoal' },
  { id: 'steel-blue',    label: 'Steel Blue',     filename: '/mockups/steel-blue.jpg',    colorSlug: 'steel-blue' },
  { id: 'military-green',label: 'Military Green', filename: '/mockups/military-green.jpg',colorSlug: 'military-green' },
  { id: 'red',           label: 'Red',            filename: '/mockups/red.jpg',           colorSlug: 'red' },
  { id: 'sport-gray',    label: 'Sport Gray',     filename: '/mockups/sport-gray.jpg',    colorSlug: 'sport-gray' },
  { id: 'white',         label: 'White',          filename: '/mockups/white.jpg',         colorSlug: 'white' },
]

// Print area as fraction of the mockup image dimensions (tweak after seeing real images)
export const PRINT_AREA = {
  xFraction: 0.28,   // left edge of print area (as fraction of image width)
  yFraction: 0.18,   // top edge of print area (as fraction of image height)
  wFraction: 0.44,   // width of print area
  hFraction: 0.50,   // height of print area
}
