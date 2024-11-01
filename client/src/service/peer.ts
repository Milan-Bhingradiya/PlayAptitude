// "use client";

// class Peerservice {
//   peer: RTCPeerConnection = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: [
//           "stun:stun.l.google.com:19302",
//           "stun:global.stun.twilio.com:3478",
//         ], // Google STUN server
//       },
//     ],
//   });

//   async getOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       if (!offer || !offer.type || !offer.sdp) {
//         console.error("Invalid offeruiop received:", offer);
//         throw new Error("Invalid offer");
//       }
//       await this.peer.setLocalDescription(offer);
//       return offer;
//     }
//   }

//   async getAnswer(offer: RTCSessionDescriptionInit) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(offer);
//       const answer = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(answer);
//       return answer;
//     }
//   }

//   async setlocalDescription(answer: RTCSessionDescriptionInit) {
//     if (this.peer) {
//       if (!answer || !answer.type || !answer.sdp) {
//         throw new Error("Invalid answer");
//       }
//       await this.peer.setRemoteDescription(answer);
//     }
//   }
// }

// const peerServiceInstance = new Peerservice();
// export default peerServiceInstance;


"use client";

class PeerService {
  public peer: RTCPeerConnection | null = null;

  constructor() {
    // Only initialize if we're in the browser
    if (typeof window !== 'undefined') {
      this.initializePeer();
    }
  }

  private initializePeer() {
    try {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to initialize RTCPeerConnection:", error);
    }
  }

  private ensurePeer() {
    if (!this.peer && typeof window !== 'undefined') {
      this.initializePeer();
    }
    if (!this.peer) {
      throw new Error("RTCPeerConnection not initialized");
    }
  }

  async getOffer() {
    this.ensurePeer();

    try {
      const offer = await this.peer!.createOffer();
      if (!offer?.type || !offer?.sdp) {
        throw new Error("Invalid offer received");
      }
      await this.peer!.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    this.ensurePeer();

    try {
      await this.peer!.setRemoteDescription(offer);
      const answer = await this.peer!.createAnswer();
      await this.peer!.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  async setLocalDescription(answer: RTCSessionDescriptionInit) {
    this.ensurePeer();

    try {
      if (!answer?.type || !answer?.sdp) {
        throw new Error("Invalid answer");
      }
      await this.peer!.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error setting remote description:", error);
      throw error;
    }
  }

  // Add cleanup method
  destroy() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
  }
}

const peerServiceInstance = new PeerService();
export default peerServiceInstance;
