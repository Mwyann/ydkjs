<?php

session_start();
if (isset($_POST['resetdebug'])) {
    unset($_SESSION['debug']);
} elseif (isset($_POST['setdebug'])) {
    foreach($_POST['debug'] as $key => $val) $_SESSION['debug'][$key] = $val;
}

$debug = array(
    'nbquestions' => '',
    'mode' => '',
    'questionnumber' => '',
    'category' => '',
    'specialquestion' => '',
    'specialGibberish' => '',
);
$debugactive = 0;
if (isset($_SESSION['debug'])) {
    $debugactive = 1;
    foreach($_SESSION['debug'] as $key => $val) $debug[$key] = $val;
}
session_write_close();

function displaySelect($values, $selected) {
    foreach($values as $val => $text) {
        $s = '';
        if ($selected == $val) $s = 'selected';
        echo '<option value="'.$val.'" '.$s.'>'.htmlspecialchars($text).'</option>';
    }
}

?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Debug YDKJ</title>

    <script src="../js/jquery-3.5.1.min.js" type="text/javascript"></script>

    <link rel="stylesheet" href="../css/ydkj.css"/>

    <style>
        label {
            display:inline-block;
            width: 200px;
            margin-right: 5px;
            text-align: right;
        }

        input[type="text"] {
            width: 50px;
        }
    </style>
</head>
<body>
<form action="gamedebug.php" method="POST">
    <strong>Debug is <?php echo ($debugactive)?'active':'inactive'; ?></strong><br/>
    <label for="nbquestions">Questions</label><select id="nbquestions" name="debug[nbquestions]"><?php displaySelect(array(7 => '7', 21 => '21'), $debug['nbquestions']); ?></select><br/>
    <label for="questionnumber">Question number</label><input type="text" id="questionnumber" name="debug[questionnumber]" value="<?php echo $debug['questionnumber']; ?>"/><br/>
    <label for="mode">Game mode</label><select id="mode" name="debug[mode]"><?php displaySelect(array(
            'None' => 'Start',
            'Category' => 'Choose question',
            'R1WrapUp' => 'Round 1 Wrap Up',
        ), $debug['mode']); ?></select><br/>
    <label for="category">Category number</label><select id="category" name="debug[category]"><?php displaySelect(array(1 => '1', 2 => '2', 3 => '3'), $debug['category']); ?></select><br/>
    <label for="specialquestion">Special question number</label><input type="text" id="specialquestion" name="debug[specialquestion]" value="<?php echo $debug['specialquestion']; ?>"/><br/>
    <label for="specialGibberish">Special question type</label><select id="specialGibberish" name="debug[specialGibberish]"><?php displaySelect(array(0 => 'Dis Or Dat', 1 => 'Gibberish'), $debug['specialGibberish']); ?></select><br/>
    <br/>
    <label></label><input type="submit" name="setdebug" value="Set debug" /> <input type="submit" name="resetdebug" value="Disable debug" /><br/>
</form>
<br/><br/>
Quick settings
<input type="button" id="quickQuestion" value="Normal question"/>
<input type="button" id="quickDisOrDat" value="DisOrDat"/>
<input type="button" id="quickGibberish" value="Gibberish"/>
<input type="button" id="quickJackAttack" value="JackAttack"/>
<input type="button" id="quickQuestion10" value="Question 10"/>

<script>
    $(function() {
        var nbquestions = $('#nbquestions');
        var questionnumber = $('#questionnumber');
        var mode = $('#mode');
        var category = $('#category');
        var specialquestion = $('#specialquestion');
        var specialGibberish = $('#specialGibberish');

        $('#quickQuestion').click(function() {
            nbquestions.val(7);
            questionnumber.val(1);
            mode.val('Category');
            category.val(1);
            specialquestion.val(4);
            specialGibberish.val(0);
        });
        $('#quickDisOrDat').click(function() {
            nbquestions.val(7);
            questionnumber.val(4);
            mode.val('Category');
            category.val(1);
            specialquestion.val(4);
            specialGibberish.val(0);
        });
        $('#quickGibberish').click(function() {
            nbquestions.val(7);
            questionnumber.val(4);
            mode.val('Category');
            category.val(1);
            specialquestion.val(4);
            specialGibberish.val(1);
        });
        $('#quickJackAttack').click(function() {
            nbquestions.val(7);
            questionnumber.val(7);
            mode.val('Category');
            category.val(1);
            specialquestion.val(4);
            specialGibberish.val(0);
        });
        $('#quickQuestion10').click(function() {
            nbquestions.val(21);
            questionnumber.val(10);
            mode.val('Category');
            category.val(1);
            specialquestion.val(4);
            specialGibberish.val(0);
        });
    });
</script>

</body>
</html>