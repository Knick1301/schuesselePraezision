<?php
declare(strict_types=1);

const EMPFAENGER = 'info@schuessele-praezision.de';
const ABSENDER = 'website@schuessele-praezision.de';
const MAX_MB = 20;
const MAX_GESAMT_MB = 40;
const ERLAUBT = ['pdf', 'step', 'stp', 'iges', 'igs', 'dxf', 'dwg'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function antwort(int $code, string $meldung): never
{
    http_response_code($code);
    echo json_encode(['ok' => $code < 300, 'meldung' => $meldung], JSON_UNESCAPED_UNICODE);
    exit;
}

function feld(string $name, int $max = 2000): string
{
    $wert = trim((string) ($_POST[$name] ?? ''));
    $wert = str_replace("\0", '', $wert);
    return mb_substr($wert, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    antwort(405, 'Nur POST erlaubt.');
}

if (feld('website') !== '') {
    antwort(200, 'Danke.');
}

$email = feld('email', 254);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    antwort(422, 'E-Mail-Adresse ungültig.');
}

$stueckzahl = feld('stueckzahl', 10);
if (!ctype_digit($stueckzahl) || (int) $stueckzahl < 1) {
    antwort(422, 'Stückzahl ungültig.');
}

if (feld('datenschutz') !== 'true') {
    antwort(422, 'Zustimmung zum Datenschutz fehlt.');
}

$dateien = [];
$gesamt = 0;
$upload = $_FILES['dateien'] ?? null;
if (!$upload || !is_array($upload['name'])) {
    antwort(422, 'Keine Datei hochgeladen.');
}
foreach ($upload['name'] as $i => $name) {
    if ($upload['error'][$i] !== UPLOAD_ERR_OK) {
        antwort(422, 'Fehler beim Hochladen einer Datei.');
    }
    $name = basename(str_replace(["\r", "\n", '"'], '', (string) $name));
    $endung = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $groesse = (int) $upload['size'][$i];
    if (!in_array($endung, ERLAUBT, true)) {
        antwort(422, "Dateiformat nicht erlaubt: $name");
    }
    if ($groesse > MAX_MB * 1024 * 1024) {
        antwort(422, "Datei zu groß: $name");
    }
    $gesamt += $groesse;
    if ($gesamt > MAX_GESAMT_MB * 1024 * 1024) {
        antwort(422, 'Dateien zusammen zu groß.');
    }
    if (!is_uploaded_file($upload['tmp_name'][$i])) {
        antwort(422, 'Ungültiger Upload.');
    }
    $dateien[] = ['name' => $name, 'inhalt' => file_get_contents($upload['tmp_name'][$i])];
}
if (!$dateien) {
    antwort(422, 'Keine Datei hochgeladen.');
}

$bauteil = feld('bauteil', 200);
$betreff = 'Anfrage: ' . ($bauteil !== '' ? $bauteil : 'Bauteil') . " – $stueckzahl Stück";
$betreff = '=?UTF-8?B?' . base64_encode(preg_replace('/[\r\n]/', ' ', $betreff)) . '?=';

$text = feld('zusammenfassung', 10000);
$text .= "\n\n---\nGesendet über das Anfrageformular auf schuessele-praezision.de";

$grenze = 'grenze_' . bin2hex(random_bytes(12));
$kopf = implode("\r\n", [
    'From: Website Schüssele Präzision <' . ABSENDER . '>',
    "Reply-To: $email",
    'MIME-Version: 1.0',
    "Content-Type: multipart/mixed; boundary=\"$grenze\"",
]);

$inhalt = "--$grenze\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($text));
foreach ($dateien as $d) {
    $kodiert = '=?UTF-8?B?' . base64_encode($d['name']) . '?=';
    $inhalt .= "--$grenze\r\n"
        . "Content-Type: application/octet-stream; name=\"$kodiert\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . "Content-Disposition: attachment; filename=\"$kodiert\"\r\n\r\n"
        . chunk_split(base64_encode($d['inhalt']));
}
$inhalt .= "--$grenze--\r\n";

if (!mail(EMPFAENGER, $betreff, $inhalt, $kopf, '-f' . ABSENDER)) {
    antwort(500, 'Die E-Mail konnte nicht versendet werden.');
}

antwort(200, 'Anfrage gesendet.');
