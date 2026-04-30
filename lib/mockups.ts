export interface MockupVariant {
  id: string
  label: string
  filename: string
  colorSlug: string
}

export const MOCKUP_VARIANTS: MockupVariant[] = [
  { id: 'black',          label: 'Black',          filename: '/mockups/shirt-black.png',         colorSlug: 'black' },
  { id: 'charcoal',       label: 'Charcoal',       filename: '/mockups/shirt-charcoal.png',      colorSlug: 'charcoal' },
  { id: 'indigoblue',     label: 'Indigo Blue',    filename: '/mockups/shirt-indigoblue.png',    colorSlug: 'indigoblue' },
  { id: 'militarygreen',  label: 'Military Green', filename: '/mockups/shirt-militarygreen.png', colorSlug: 'militarygreen' },
  { id: 'red',            label: 'Red',            filename: '/mockups/shirt-red.png',           colorSlug: 'red' },
  { id: 'sportgrey',      label: 'Sport Grey',     filename: '/mockups/shirt-sportgrey.png',     colorSlug: 'sportgrey' },
  { id: 'white',          label: 'White',          filename: '/mockups/shirt-white.png',         colorSlug: 'white' },
]

// Print area as fraction of the mockup image dimensions (tweak after seeing real images)
export const PRINT_AREA = {
  xFraction: 0.28,   // left edge of print area (as fraction of image width)
  yFraction: 0.18,   // top edge of print area (as fraction of image height)
  wFraction: 0.44,   // width of print area
  hFraction: 0.50,   // height of print area
}
