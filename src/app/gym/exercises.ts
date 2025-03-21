const exercises = [
  { name: 'deadlift', mainMuscle: 'legs', type: 'weight', bestPractice: 'Keep your back straight and lift with your legs', keyMovement: 'pull' },
  { name: 'leg extension', mainMuscle: 'legs', type: 'weight', bestPractice: 'Use controlled motion and avoid locking your knees at the top', keyMovement: '' },
  { name: 'inclined leg press', mainMuscle: 'legs', type: 'weight', bestPractice: 'Focus on a full range of motion while keeping your back against the seat', keyMovement: 'push' },
  { name: 'seated calf raise', mainMuscle: 'legs', type: 'weight', bestPractice: 'Perform slowly and squeeze at the top to maximize calf engagement', keyMovement: '' },
  { name: 'leg raise', mainMuscle: 'legs', type: 'weight', bestPractice: 'Keep your core engaged and avoid swinging your legs', keyMovement: '' },
  { name: 'dips', mainMuscle: 'arms', type: 'weight', bestPractice: 'Maintain a straight body and lower slowly to reduce shoulder strain', keyMovement: 'push' },
  { name: 'seated cable row', mainMuscle: 'back', type: 'weight', bestPractice: 'Pull with your back muscles and keep a slight bend in your elbows', keyMovement: 'pull' },
  { name: 'butterfly', mainMuscle: 'chest', type: 'weight', bestPractice: 'Control the movement and avoid using momentum for chest isolation', keyMovement: '' },
  { name: 'reverse butterfly', mainMuscle: 'chest', type: 'weight', bestPractice: 'Squeeze your shoulder blades together to target the upper back', keyMovement: 'pull' },
  { name: 'mountain climbers', mainMuscle: 'core', type: 'weight', bestPractice: 'Keep your core tight and pace yourself for steady cardio', keyMovement: '' },
  { name: 'shoulder press', mainMuscle: 'shoulders', type: 'weight', bestPractice: 'Press evenly and avoid locking your elbows to protect your joints', keyMovement: 'push' },
  { name: 'barbell squat', mainMuscle: 'glutes', type: 'weight', bestPractice: 'Keep your chest up and ensure your knees follow your toes', keyMovement: '' },
  { name: 'military plank', mainMuscle: 'full body', type: 'weight', bestPractice: 'Maintain a straight line from head to heels and engage your core', keyMovement: '' },
  { name: 'leg press', mainMuscle: 'legs', type: 'weight', bestPractice: 'Adjust the seat to ensure proper knee alignment and controlled movement', keyMovement: 'push' },
  { name: 'stepper', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Keep a steady pace and engage your legs fully for effective cardio', keyMovement: '' },
  { name: 'assault bike', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Maintain a consistent rhythm and focus on full pedal strokes', keyMovement: '' },
  { name: 'exercise bike', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Adjust the resistance to challenge yourself without compromising form', keyMovement: '' },
  { name: 'elliptical', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Keep your posture upright and ensure smooth, controlled strides', keyMovement: '' },
  { name: 'sun salutation', mainMuscle: 'full body', type: 'stretch', bestPractice: 'Focus on your breath and move fluidly through each pose', keyMovement: '' },
  { name: 'lat pulldown', mainMuscle: 'back', type: 'weight', bestPractice: 'Engage your back muscles and avoid using momentum to pull', keyMovement: 'pull' },
  { name: 'pullup', mainMuscle: 'back', type: 'weight', bestPractice: 'Keep your core tight and pull with your back rather than your arms', keyMovement: 'pull' },
  { name: 'bench press', mainMuscle: 'chest', type: 'weight', bestPractice: 'Lower the bar slowly and ensure a controlled push up', keyMovement: 'push' },
  { name: 'pushup', mainMuscle: 'chest', type: 'weight', bestPractice: 'Keep your body in a straight line and lower until your elbows are at 90 degrees', keyMovement: 'push' },
  { name: 'plank', mainMuscle: 'core', type: 'weight', bestPractice: 'Maintain a straight posture and keep your hips level', keyMovement: '' },
  { name: 'side plank', mainMuscle: 'core', type: 'weight', bestPractice: 'Focus on balance and keep your body aligned throughout the hold', keyMovement: '' },
  { name: 'crunch', mainMuscle: 'core', type: 'weight', bestPractice: 'Exhale as you lift and avoid pulling on your neck', keyMovement: '' },
  { name: 'situp', mainMuscle: 'core', type: 'weight', bestPractice: 'Use your abdominal muscles rather than your neck to lift', keyMovement: '' },
  { name: 'leg curl', mainMuscle: 'legs', type: 'weight', bestPractice: 'Control the curl movement and avoid using excessive weight', keyMovement: 'pull' },
  { name: 'seated mid row', mainMuscle: 'back', type: 'weight', bestPractice: 'Pull your shoulder blades together and keep your back straight', keyMovement: 'pull' },
  { name: 'treadmill', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Maintain a steady pace and focus on your breathing', keyMovement: '' },
  { name: 'rowing machine', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Keep a smooth rhythm and use both legs and arms effectively', keyMovement: '' },
  { name: 'seated chess press', mainMuscle: 'chest', type: 'weight', bestPractice: 'Keep your back supported and press evenly with both arms', keyMovement: 'push' },
  { name: 'seated low row', mainMuscle: 'back', type: 'weight', bestPractice: 'Focus on squeezing your back muscles and maintain proper form', keyMovement: 'pull' },
  { name: 'tricep pull down', mainMuscle: 'arms', type: 'weight', bestPractice: 'Keep your elbows close to your body and extend fully for tricep engagement', keyMovement: 'push' },
  { name: 'shoulder stretch', mainMuscle: 'shoulders', type: 'stretch', bestPractice: 'Hold gently without bouncing to release shoulder tension', keyMovement: '' },
  { name: 'quad stretch', mainMuscle: 'legs', type: 'stretch', bestPractice: 'Keep your knee aligned and hold each side for balance', keyMovement: '' },
  { name: 'hamstring stretch', mainMuscle: 'legs', type: 'stretch', bestPractice: 'Keep your back straight and lean into the stretch slowly', keyMovement: '' },
  { name: 'tricep stretch', mainMuscle: 'arms', type: 'stretch', bestPractice: 'Keep your arm close to your head and feel the stretch in your tricep', keyMovement: '' },
  { name: 'seated lower back rotational stretch', mainMuscle: 'back', type: 'stretch', bestPractice: 'Move slowly to avoid strain and feel a gentle twist in your lower back', keyMovement: '' },
  { name: 'seated neck stretch', mainMuscle: 'neck', type: 'stretch', bestPractice: 'Tilt your head slowly and gently hold to avoid tension', keyMovement: '' },
  { name: 'cat stretch', mainMuscle: 'back', type: 'stretch', bestPractice: 'Move fluidly and focus on rounding your back for a good stretch', keyMovement: '' },
  { name: 'childs pose', mainMuscle: 'back', type: 'stretch', bestPractice: 'Relax your muscles and breathe deeply in this restorative pose', keyMovement: '' },
  { name: 'cobra stretch', mainMuscle: 'back', type: 'stretch', bestPractice: 'Lift gradually and keep your lower back relaxed during the stretch', keyMovement: '' },
  { name: 'knee to chest', mainMuscle: 'back', type: 'stretch', bestPractice: 'Hold each side steadily to relieve lower back tension', keyMovement: '' },
  { name: 'wrist extensor stretch', mainMuscle: 'arms', type: 'stretch', bestPractice: 'Extend your wrist gently and hold to relieve forearm tension', keyMovement: '' },
  { name: 'chest opener', mainMuscle: 'chest', type: 'stretch', bestPractice: 'Open your arms wide and gently stretch your chest muscles', keyMovement: '' },
  { name: 'wrist flexor stretch', mainMuscle: 'arms', type: 'stretch', bestPractice: 'Gently pull your fingers back and hold to stretch your wrist flexors', keyMovement: '' },
  { name: 'recumbent bike', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Adjust the seat for proper alignment and focus on a smooth pedal stroke', keyMovement: '' },
  { name: 'ab rollout', mainMuscle: 'core', type: 'weight', bestPractice: 'Keep your core engaged and avoid arching your back during the movement', keyMovement: '' },
  { name: 'skillmill', mainMuscle: 'legs', type: 'cardio', bestPractice: 'Maintain an upright posture and control your pace for optimal performance', keyMovement: '' }
]

export default exercises

const modalities = [
  { 
    name: 'weight',
    defaultDetails: {
      sets: [
        { reps: '10', weight: '10' },
        { reps: '10', weight: '15' },
        { reps: '10', weight: '20' }
      ],
      time: '',
      intensity: '',
      reps: ''
    }
  },
  { 
    name: 'cardio',
    defaultDetails: {
      sets: [],
      time: '10',
      intensity: '10',
      reps: ''
    }
  },
  { 
    name: 'stretch',
    defaultDetails: {
      sets: [],
      time: '10',
      intensity: '',
      reps: '10'
    }
  }
]

export { modalities }
