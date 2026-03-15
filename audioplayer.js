// audio-player.js
document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.audio-player');

    players.forEach(player => {
        const audioSrc = player.dataset.src;
        if (!audioSrc) return;

        const audio = new Audio(audioSrc);
        const playBtn = player.querySelector('.audio-play-pause');
        const progressBar = player.querySelector('.audio-progress-bar');
        const progressContainer = player.querySelector('.audio-progress-container');
        const timeDurationSpan = player.querySelector('.audio-time-duration');

        let duration = 0;

        // Форматирование времени (mm:ss)
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        // Обновление отображения времени/длительности
        function updateTimeDisplay() {
            const current = audio.currentTime;
            timeDurationSpan.textContent = `${formatTime(current)}/${formatTime(duration)}`;
        }

        // При загрузке метаданных
        audio.addEventListener('loadedmetadata', () => {
            duration = audio.duration;
            updateTimeDisplay();
        });

        // При обновлении времени
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / duration) * 100;
            progressBar.style.width = percent + '%';
            updateTimeDisplay();
        });

        // Play / Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = '⏸';
            } else {
                audio.pause();
                playBtn.textContent = '▶';
            }
        });

        // Перемотка по клику на прогресс
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            if (duration) {
                audio.currentTime = (clickX / width) * duration;
            }
        });

        // По окончании
        audio.addEventListener('ended', () => {
            playBtn.textContent = '▶';
            progressBar.style.width = '0%';
            timeDurationSpan.textContent = `0:00/${formatTime(duration)}`;
        });
    });
});