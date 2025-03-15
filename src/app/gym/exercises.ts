const exercises = [
  { name: 'deadlift', mainMuscle: 'legs', type: 'weight' },
  { name: 'leg extension', mainMuscle: 'legs', type: 'weight' },
  { name: 'inclined leg press', mainMuscle: 'legs', type: 'weight' },
  { name: 'seated calf raise', mainMuscle: 'legs', type: 'weight' },
  { name: 'leg raise', mainMuscle: 'legs', type: 'weight' },
  { name: 'dips', mainMuscle: 'arms', type: 'weight' },
  { name: 'seated cable row', mainMuscle: 'back', type: 'weight' },
  { name: 'butterfly', mainMuscle: 'chest', type: 'weight' },
  { name: 'reverse butterfly', mainMuscle: 'chest', type: 'weight' },
  { name: 'mountain climbers', mainMuscle: 'core', type: 'weight' },
  { name: 'shoulder press', mainMuscle: 'shoulders', type: 'weight' },
  { name: 'barbell squat', mainMuscle: 'glutes', type: 'weight' },
  { name: 'military plank', mainMuscle: 'full body', type: 'weight' },
  { name: 'leg press', mainMuscle: 'legs', type: 'weight' },
  { name: 'stepper', mainMuscle: 'legs', type: 'cardio' },
  { name: 'assault bike', mainMuscle: 'legs', type: 'cardio' },
  { name: 'exercise bike', mainMuscle: 'legs', type: 'cardio' },
  { name: 'elliptical', mainMuscle: 'legs', type: 'cardio' },
  { name: 'sun salutation', mainMuscle: 'full body', type: 'stretch' },
  { name: 'lat pulldown', mainMuscle: 'back', type: 'weight' },
  { name: 'pullup', mainMuscle: 'back', type: 'weight' },
  { name: 'bench press', mainMuscle: 'chest', type: 'weight' },
  { name: 'pushup', mainMuscle: 'chest', type: 'weight' },
  { name: 'plank', mainMuscle: 'core', type: 'weight' },
  { name: 'side plank', mainMuscle: 'core', type: 'weight' },
  { name: 'crunch', mainMuscle: 'core', type: 'weight' },
  { name: 'situp', mainMuscle: 'core', type: 'weight' },
  { name: 'leg curl', mainMuscle: 'legs', type: 'weight' },
  { name: 'seated mid row', mainMuscle: 'back', type: 'weight' },
  { name: 'treadmill', mainMuscle: 'legs', type: 'cardio' },
  { name: 'rowing machine', mainMuscle: 'legs', type: 'cardio' },
]

export default exercises

const modalities = [
  { name: 'weight' },
  { name: 'cardio' },
  { name: 'stretch' }
]

export { modalities }
