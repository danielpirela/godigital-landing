# Ambient Audio

## Purpose

Ambient audio provides a mmx-generated 60-second ambient music loop (`assets/generated/ambient.mp3`) that creates atmosphere without distracting from the page content. The audio is user-gated (starts muted, requires explicit user interaction to unmute) to comply with browser autoplay policies. The `AudioToggle` component provides persistent mute/unmute control. `prefers-reduced-motion` users hear no audio at all.

Ref: Proposal §Approach (Global row) · §Asset #13 (ambient music) · §ambient-audio capability

## Requirements

### Requirement: AMBIENT_AUDIO_USER_GATED
The ambient audio `<audio>` element SHALL have `autoplay` removed and `muted` attribute present by default.

The `AudioToggle.astro` component SHALL display a speaker icon that, on click, calls `audioElement.play()` and removes the `muted` attribute.

Audio SHALL NOT play until the user explicitly activates it for the first time (browser autoplay compliance).

#### Scenario: Audio plays after user click
Given the page loads with ambient audio element
When the user has not interacted with the audio toggle
Then `audioElement.muted === true`
When the user clicks the AudioToggle button
Then `audioElement.play()` is called
And `audioElement.muted` becomes `false`
And the button icon changes to indicate unmuted state

### Requirement: AMBIENT_AUDIO_LOOP
The `<audio>` element SHALL have `loop` attribute set.

Volume SHALL be set to 0.15 (15%) via `audioElement.volume = 0.15`.

The audio element SHALL load `assets/generated/ambient.mp3` as its `src` with `data-mmx-generated="ambient-music"`.

#### Scenario: Audio loops seamlessly at low volume
Given the audio is unmuted and playing
When the audio reaches its end
Then it seamlessly restarts from the beginning
And volume remains at 0.15
And no user action is required to restart

### Requirement: AMBIENT_AUDIO_REDUCED_MOTION_SKIP
When `prefers-reduced-motion: reduce` is active, the `AudioToggle` component SHALL NOT render.

No `<audio>` element SHALL be created or loaded.

This is enforced by the `prefers-reduced-motion` matchMedia context in `initAnimations()`.

#### Scenario: Reduced-motion user sees no audio UI
Given the OS has `prefers-reduced-motion: reduce`
When the page loads
Then `AudioToggle.astro` is not rendered
And no audio element exists in the DOM
And no audio playback occurs under any circumstance

### Requirement: AUDIO_TOGGLE_COMPONENT
The `AudioToggle.astro` component SHALL render a `<button>` with `class="audio-toggle"` and `aria-label="Activar audio ambiental"`.

The button state SHALL reflect audio mute/unmute via `aria-pressed` and icon change (speaker icon vs muted speaker icon).

The component SHALL be positioned fixed at the bottom-right corner (`position: fixed; bottom: 2rem; right: 2rem; z-index: 50`).

#### Scenario: Toggle button reflects current state
Given `audioElement.muted === true`
When the AudioToggle button renders
Then `aria-pressed="false"` and muted speaker icon is visible
When `audioElement.muted === false`
Then `aria-pressed="true"` and speaker icon is visible
And tapping the button toggles the mute state