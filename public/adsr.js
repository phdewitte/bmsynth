//taken from Beep code to be scrapped for our own


Beep.Voice.prototype.pause = function(){

  var timeNow = this.audioContext.currentTime


  //  Cancel all your plans.
  //  And let’s tween from the current gain value.

  this.gainNode.gain.cancelScheduledValues( timeNow )
  this.gainNode.gain.setValueAtTime( this.gainNode.gain.value, timeNow )


  //  Now let’s schedule a ramp down to zero gain for the Release.

  this.gainNode.gain.linearRampToValueAtTime( 0.0001, timeNow + this.releaseDuration )
  //this.gainNode.gain.exponentialRampToValueAtTime( 0.0001, timeNow + this.releaseDuration )
  this.gainNode.gain.setValueAtTime( 0, timeNow + this.releaseDuration + 0.0001 )

  return this
}


//  Or you know what? Maybe we do want to just kill it.
//  Like sawing off the branch you’re sitting on.

Beep.Voice.prototype.teardown = function(){

  if( this.isTorndown === false ){

    if( this.oscillator ){
      if( this.isPlaying ) this.oscillator.stop( 0 )// Stop oscillator after 0 seconds.
      this.oscillator.disconnect()// Disconnect oscillator so it can be picked up by browser’s garbage collector.
    }
    if( this.source ) this.source.disconnect()
    this.isTorndown = true
  }
  return this
}




//  Some convenience getters and setters.
//
//  Q: OMG, why? It’s not like we’re protecting private variables.
//     You can already directly access these properties!
//  A: Sure, sure. But by creating setters that return “this”
//     you can easily do function-chaining and never have to create
//     and set temporary variables, like this:
//
//     voices.push(
//
//         new Beep.Voice( this.note.hertz * 3 / 2, this.audioContext )
//         .setOscillatorType( 'triangle' )
//         .setAttackGain( 0.3 )
//     )
//
//     As for the getters, it just felt rude to create the setters
//    (thereby leading the expectation that getters would also exist)
//     without actually having getters.

;[
  'delayDuration',
  'attackGain',
  'attackDuration',
  'decayDuration',
  'sustainGain',
  'sustainDuration',
  'releaseDuration'

].forEach( function( propertyName ){

  var propertyNameCased = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 )

  Beep.Voice.prototype[ 'get'+ propertyNameCased ] = function(){

    return this[ propertyName ]
  }
  Beep.Voice.prototype[ 'set'+ propertyNameCased ] = function( x ){

    this[ propertyName ] = x
    return this
  }
})
Beep.Voice.prototype.getOscillatorType = function(){

  return this.oscillator ? this.oscillator.type : undefined
}
Beep.Voice.prototype.setOscillatorType = function( string ){

  if( this.oscillator ) this.oscillator.type = string
  return this
}




