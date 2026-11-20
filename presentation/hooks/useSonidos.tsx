import { useCasino } from "@/presentation/hooks/CasinoContext";
import { useAudioPlayer } from "expo-audio";

export const useSonidos = () => {
  const { sonidoActivo } = useCasino();

  const spinPlayer = useAudioPlayer(require("@/assets/audio/reelSpin.mp3"));
  const stopPlayer = useAudioPlayer(require("@/assets/audio/reelStop.mp3"));
  const coinPlayer = useAudioPlayer(require("@/assets/audio/coinHandling.wav"));
  const winSmallPlayer = useAudioPlayer(require("@/assets/audio/winSmall.wav"));
  const winBigPlayer = useAudioPlayer(require("@/assets/audio/slotWin.mp3"));
  const bonusPlayer = useAudioPlayer(require("@/assets/audio/slotFeature.mp3"));

  const reproducir = (player: ReturnType<typeof useAudioPlayer>) => {
    if (!sonidoActivo) return;
    player.seekTo(0);
    player.play();
  };

  const playSpin = () => {
    if (!sonidoActivo) return;
    spinPlayer.loop = true;
    spinPlayer.seekTo(0);
    spinPlayer.play();
  };

  const stopSpin = () => {
    spinPlayer.pause();
  };

  const playReelStop = () => reproducir(stopPlayer);
  const playCoin = () => reproducir(coinPlayer);
  const playWinSmall = () => reproducir(winSmallPlayer);
  const playWinBig = () => reproducir(winBigPlayer);
  const playBonus = () => reproducir(bonusPlayer);

  return {
    playSpin,
    stopSpin,
    playReelStop,
    playCoin,
    playWinSmall,
    playWinBig,
    playBonus,
  };
};
