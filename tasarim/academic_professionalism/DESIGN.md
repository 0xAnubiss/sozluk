---
name: Academic Professionalism
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd9e1'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fb'
  surface-container: '#efecf5'
  surface-container-high: '#eae7ef'
  surface-container-highest: '#e4e1ea'
  on-surface: '#1b1b21'
  on-surface-variant: '#454652'
  inverse-surface: '#303036'
  inverse-on-surface: '#f2eff8'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#785900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc003'
  on-secondary-container: '#6c5000'
  tertiary: '#380b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c1800'
  on-tertiary-container: '#e17c5a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#fabd00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#7b2e12'
  background: '#fbf8ff'
  on-background: '#1b1b21'
  surface-variant: '#e4e1ea'
typography:
  display-word:
    fontFamily: Source Serif Four
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-word-mobile:
    fontFamily: Source Serif Four
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  definition-main:
    fontFamily: Source Serif Four
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  ui-label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  ui-label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  metadata-tag:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
  body-copy:
    fontFamily: Source Serif Four
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1024px
  gutter: 24px
  margin-mobile: 16px
  stack-compact: 4px
  stack-loose: 32px
---

## Brand & Style

The design system is anchored in the concept of "Digital Scholarship." It bridges the gap between the weight of traditional printed encyclopedias and the efficiency of modern SaaS interfaces. The personality is authoritative, precise, and sophisticated, targeting researchers, students, and linguists who require a distraction-free environment for deep focus.

The style is **Modern Corporate** with heavy **Minimalist** influences. It prioritizes content hierarchy above all else. By using a "Typography-First" approach, the interface fades into the background, allowing the structural beauty of the definitions and metadata to take center stage. High-end editorial layouts inspire the composition, ensuring that white space acts as a functional tool for legibility rather than just an aesthetic choice.

## Colors

The palette is rooted in institutional trust. The **Deep Indigo** primary color is used for navigational anchors, primary actions, and branding, evoking the feeling of a prestigious university library. **Soft Amber** serves as a functional accent, reserved strictly for interactive feedback, ratings, and highlighting search hits to ensure high visibility without sacrificing the academic tone.

Surface colors utilize an **Off-white** base to reduce eye strain during long reading sessions, while **Deep Charcoal** provides maximum contrast for body text. A system of neutral greys is used to distinguish between primary definitions and tertiary metadata.

## Typography

This design system employs a dual-typeface strategy to separate content from interface. 

**Source Serif Four** is utilized for all "knowledge" content—word titles, definitions, and etymology. Its sturdy, legible serifs provide the necessary gravitas and traditional feel.

**Inter** is reserved for the "engine" of the platform—navigation, search inputs, buttons, and technical metadata. This distinction helps the user subconsciously separate the platform's tools from the data they are consuming.

For hierarchical clarity, word entries use a large Display weight, while CEFR levels (A1-C2) use uppercase Inter to denote their status as categorical data rather than narrative text.

## Layout & Spacing

The design system uses a **Fixed Grid** model for desktop to maintain optimal line lengths for reading. Content is centered with a maximum width of 1024px, preventing the horizontal "stretching" of definitions which can hinder scanning.

A 12-column system is used, but definitions typically occupy a central 8-column "reading track," while secondary metadata like word origins or related terms live in a 4-column sidebar or beneath the main entry. 

Spacing follows a strict 8px rhythmic scale. "Stack-loose" (32px) is used to separate distinct dictionary entries, while "Stack-compact" (4px) is used between a word and its phonetic transcription.

## Elevation & Depth

To maintain a clean, academic aesthetic, this design system avoids heavy drop shadows. Depth is conveyed through **Low-Contrast Outlines** and **Tonal Layers**. 

Card elements use a 1px solid border in a soft grey (#E0E0E0). When an element requires focus, such as a "Word of the Day" card or a search result, a very soft, ambient shadow with a large blur radius (16-24px) and low opacity (4-6%) is applied to give a subtle sense of "lifting" without breaking the flat, professional plane of the page.

## Shapes

The design system utilizes a **Soft (0.25rem)** roundedness. This subtle curve prevents the interface from feeling overly clinical or "sharp," while remaining far more professional than the bubbly, high-radius curves found in consumer social apps. 

Search bars and primary buttons maintain this consistent radius to create a unified visual language. Metadata tags (like CEFR levels) use the same radius to appear as sturdy badges rather than fluid pills.

## Components

### Search Bar
The central component of the platform. It must be high-contrast, featuring a thick 2px Indigo border on focus and a clear, sans-serif placeholder. It is the only element that may use a slightly higher elevation to signify its priority.

### Metadata Badges (CEFR)
Used for levels A1 through C2. These use a "Ghost" style: a subtle background tint of the primary color with high-weight sans-serif text. They should be positioned consistently to the top-right of the main word title.

### Action Buttons
Primary buttons are solid Deep Indigo with white text. Secondary buttons are "Ghost" style with an Indigo border and text. All interactive states use a slight darken transform rather than a color shift to maintain the formal palette.

### Word Cards
Definitions are housed in cards with a white background, a subtle 1px border, and no shadow. The header of the card uses the serif display type, while the footer—containing voting and social actions—uses small-caps sans-serif for a refined, editorial look.

### Star Ratings
Interactive stars for "Word Quality" or "User Contributions" use the Secondary Amber color. Unfilled stars should use a light grey stroke to remain unobtrusive until active.